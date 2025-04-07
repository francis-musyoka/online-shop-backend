
const db = require('../../utils/database');
const ErrorResponse = require('../../utils/error');
const { validatePassword } = require('../../utils/validate');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { generateToken,cookieOptions, generateResetToken, mergeGuestCart } = require('../../utils/index');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const {sha512} = require('js-sha512');


const {Customer,sequelize,Sequelize} = db;
const {Op} = Sequelize;

exports.createUser = async(req,res,next)=>{
    const {firstName,lastName,email,password,confirmPassword} = req.body;
    
    const id = uuidv4().replace(/-/g, '');

    try {
        const isEmailExist = await Customer.findOne({where:{email:email}});
        
        if(isEmailExist){
            return next(new ErrorResponse(`This ${email} already exist`,400))
        };

        const validate = await validatePassword(password,confirmPassword);

        if(!validate.success){
            return next(new ErrorResponse(validate.message,400))
        };

        const hashedPassword = await bcrypt.hash(password,10);

        await Customer.create({
            id: id,
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword
        });

        res.status(201).json({
                success : true,
            });

    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                success: false,
                errors: error.errors.map(error => error.message) 
            });
        }else{
            next(error)
        };
    };
};

exports.signin = async(req,res,next)=>{
    const {email,password,guestId} = req.body;
    const transaction = await sequelize.transaction();

    try {
        const user = await Customer.findOne({where:{email:email}});

        if(!user){
            return next(new ErrorResponse('Wrong email or password', 401))
        };

        //VALIDATE PASSWORD
        const isPasswordValid = await bcrypt.compare(password,user.password);
        
        if(!isPasswordValid){
            return next(new ErrorResponse('Wrong email or password',401));
        };

        // Merge guest cart if guestId is provided
        if (guestId) await mergeGuestCart(guestId, user.id, transaction,next);

        // Commit transaction
        await transaction.commit();


        //generate token:
        const token = generateToken(user);

        //save token 
        await user.update({ token:token });
        
        res.status(200)
            .cookie('token', token, cookieOptions)
            .json({success: true, token});

    } catch (error) {
       await transaction.rollback()
        next(error)
        
    };
};

exports.getSingleUser = async(req,res,next)=>{
    const id = req.params.id;
    try {
        const user = await Customer.findOne({where:{id:id}});
        res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        next(error)
    }
};

exports.getUserProfile = (req,res,next)=>{
     res.status(202).json({success: true, user:req.user})
};

exports.getAllUsers = async(req,res,next)=>{
    try {
        const users = await Customer.findAll();
        res.status(200).json({
            success: true,
            users
        });
    } catch (error) {
        next(error)
    }
};

exports.updateUseProfile = async(req,res,next)=>{
    const {id} = req.params;
    const {firstName,lastName,email} = req.body;
    console.log(id);

    try {
        const isEmailExist = await Customer.findOne({
            where:{
                email:email,
                id:{[Op.ne]:id}
            }
        });

        if(isEmailExist){
            return next(new ErrorResponse(`This ${email} already exist`,400))
        };

        await req.user.update({firstName:firstName,lastName:lastName,email:email});

        res.status(200).json({
            success: true,
            msg:'Successfully updated'
        });
        
    } catch (error) {
        next(error)
    };
};

exports.updatePassword = async(req,res,next)=>{
    const {id} = req.params;
    const {currentPassword,password,confirmPassword} = req.body;

    try {

        // Check if the ID from the URL is the same as the one associated with the logged-in user.
        if(id !== req.user.id){
            return next(new ErrorResponse("Access denied",401))
        }

        //Get user 
        const user = await Customer.findOne({where:{id:id}});

        // Compare current password and password in database
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword,user.password);
            
        if(!isCurrentPasswordValid){
            return next(new ErrorResponse('The current password is incorrect.', 400));
        };
    
        if(currentPassword === password){
            return next(new ErrorResponse('New password must be different from the current password.', 400))
        };
    
        // Validate password
        const validate = await validatePassword(password,confirmPassword);
    
        if(!validate.success){
            return next(new ErrorResponse(validate.message,400))
        };
    
        // Hash Password
        const hashedPassword = await bcrypt.hash(password,10);
    
        // UPdate password 
        await user.update({password:hashedPassword});
    
        res.status(200).json({
            success:true,
            msg:"Password succefully Updated"
        });

    } catch (error) {
        next(error);
    };
};

exports.logOUt = async(req,res,next)=>{
    try {
        const {token} = req.cookies
    
        if(!token){
            return next(new ErrorResponse("Unauthorized: You must have token ",400));
        };

        const user = await Customer.findOne({where:{token:token}});
        if(!user){
            return next(new ErrorResponse("Invalid token provided",404));
        };

        const decodeToken = jwt.decode(token);
        if(user.id !== decodeToken.id){
            return next(new ErrorResponse("Invalid token provided",404))
        }
        
        await user.update({token:null})

        res.status(200)
            .cookie('token',"",cookieOptions)
            .json({success:true})

    } catch (error) {
        next(error)
    };    
    
};

exports.forgotPassword = async(req,res,next)=>{
    const {email} = req.body;
    try {
        const user = await Customer.findOne({where:{email:email}});
        
        if(!user){
            return next(new ErrorResponse("Email provided does not exist", 404));
        };
        
        const link = await generateResetToken(user);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.E_MAIL,
                pass: process.env.PASSWORDAPP
            }
        });
          
        const mailOptions = {
            from: process.env.E_MAIL,
            to: email,
            subject: 'Password Reset',
            html: `<b>Hello ${user.firstName} ${user.lastName},</b>
                    <p>Tap the link below to reset password<p/>
                    <p>The link expires in <b>10 minutes</b><p/>
                    <p>${link}</p>

                    If you did not make the request ignore. `,
        };
          
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log("........???", error);
                return next(new ErrorResponse('Sorry, Error occured when sent email',500))
                
            } else {
                console.log('Email sent: ' + info.response);
                res.status(200).json({
                    success: true, 
                    msg: "Email was sent successfully",
                });
            };
        });

    } catch (error) {
        next(error)
    };
};

exports.resetPassword = async(req,res,next)=>{
    const {link} = req.params
    const {password,confirmPassword} = req.body;

    try {

        //Trim the link to remove whitespaces
        const trimLink = link.trim();

        if(!trimLink){
            return next(new ErrorResponse('Access denied: You must have are link', 401))
        };

        // Hash the provided link
        const hashedToken = sha512(trimLink); 
        

        // Find the user with the matching hashed token and ensure it's not expired
        const user = await Customer.findOne({where:{
            forgotPasswordLink: hashedToken,
            linkExpiresIn: {[Op.gt]: new Date()},
            }
        });

        if(!user){
            return next(new ErrorResponse('Reset password link provided is invalid or has expired',400));
        };
    
        // Validate password
        const validate = await validatePassword(password,confirmPassword);
        
        if(!validate.success){
            return next(new ErrorResponse(validate.message,400))
        };
     
        // Hash Password
        const hashedPassword = await bcrypt.hash(password,10);
     
        // UPdate user 
        user.forgotPasswordLink = null;
        user.linkExpiresIn = null;
        user.password = hashedPassword;
        await user.save();
     
        res.status(200).json({
            success:true,
            msg:"Password succefully Updated"
        });

    } catch (error) {
        next(error);
    };
};