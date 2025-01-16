const { generateResetShopToken, generateForgotPasswordToken, generateLogInShopToken, cookieOptions } = require('../utils');
const db = require('../utils/database');
const ErrorResponse = require('../utils/error');
const { validatePassword } = require('../utils/validate');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const {sha512} = require('js-sha512');

const {Shop} = db;
const {Op} = db.Sequelize;

exports.createShop = async(req,res,next)=>{
    const {businessName,businessNumber,email,password, confirmPassword,addressLine1,addressLine2,city,state,zipCode} = req.body;
    try {

        const uuid = uuidv4();
        const id = uuid.replace(/-/g, '');

        const isBusinessNameExist = await Shop.findOne({where:{businessName:businessName}});
        if(isBusinessNameExist){
            return next(new ErrorResponse(`The business name already exist`, 404));
        };

        const isBusinessNumberExist = await Shop.findOne({where:{businessNumber:businessNumber}});
        if(isBusinessNumberExist){
            return next(new ErrorResponse(`The business number already exist`, 404));
        };

        const isEmailExist = await Shop.findOne({where:{email:email}});
        if(isEmailExist){
            return next(new ErrorResponse(`The email already exist`, 404));
        };

        const validated = await validatePassword(password,confirmPassword);

        if(!validated.success){
            return next(new ErrorResponse(validated.message, 404))
        };

        const hashedPassword = await bcrypt.hash(password,10);

        const shop = await Shop.create({
            id: id,
            businessName: businessName,
            businessNumber: businessNumber,
            email: email,
            password: hashedPassword,
            addressLine1: addressLine1,
            addressLine2: addressLine2,
            city: city,
            state: state,
            zipCode: zipCode
        })

        res.status(201).json({
            success: true,
            msg: "Shop created Successfully",
            shop
        })

    } catch (error) {
        next(error)
    }
    
};

exports.logIn = async(req,res,next)=>{
    const {email, password} = req.body;
    console.log("Email::", email );
    console.log("Password::", password );
     try {
        const shop = await Shop.findOne({where:{email:email}});
        console.log(shop);
        
        if(!shop){
            return next(new ErrorResponse("Wrong email or password", 401));
        };

        const isPasswordCorrect = await bcrypt.compare(password ,shop.password);

        if(!isPasswordCorrect){
            return next(new ErrorResponse("Wrong email or password", 401));
        };

        const token = await generateLogInShopToken(shop);

        shop. accessToken = token;
        await shop.save();

        res.status(200)
        .cookie('token', token, cookieOptions)
        .json({
            success: true,
            msg: 'Log In successfully',
            token
        })
     } catch (error) {
        next(error)
     }
};


exports.getSingleShop = async(req,res,next)=>{
    const id = req.params.id;
    try {
        const shop = await Shop.findOne({where:{id:id}});
        res.status(200).json({
            success: true,
            shop
        })
    } catch (error) {
        next(error)
    }
};

exports.getShopProfile = (req,res,next)=>{
     res.status(202).json({success: true, shopProfile: req.shop})
};

exports.getAllShops = async(req,res,next)=>{
    try {
        const shops = await Shop.findAll();
        res.status(200).json({
            success: true,
            shops
        });
    } catch (error) {
        next(error)
    }
};

exports.forgotPassword = async(req,res,next)=>{
    const {email} = req.body;

    console.log(email);
    
    try {
        const shop = await Shop.findOne({where:{email:email}});
        
        if(!shop){
            return next(new ErrorResponse("Email provided does not exist", 404));
        };
       
        const link = await generateResetShopToken(shop);

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
            html: `<b>Hello ${shop.firstName} ${shop.lastName},</b>
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
                    link
                });
            };
        });

    } catch (error) {
        next(error)
    };
};


exports.logOut = async(req,res,next)=>{
    const {token} = req.cookies;

    console.log(token);
    

    if(!token){
        return next(new ErrorResponse("Unauthorized: You must have token ",400));
    };

    try {
        const getShop = await Shop.findOne({where:{accessToken:token}});

        if(!getShop){
            return next(new ErrorResponse("Invalide toke provided",404));
        };

        const decodeToken = jwt.decode(token);

        if(decodeToken.id !== getShop.id){
            return next(new ErrorResponse("Invalid token provided",404))
        }

        getShop.accessToken = null;
        await getShop.save();

        res.status(200)
        .cookie('token', "", cookieOptions)
        .json({success: true, msg:'Log out successfully'})

    } catch (error) {
        next(error)
    }
};


exports.resetShopPassword = async(req,res,next)=>{
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
        const shop = await Shop.findOne({where:{
            forgotPasswordLink: hashedToken,
            linkExpiresIn: {[Op.gt]: new Date()},
            }
        });

        if(!shop){
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
        shop.forgotPasswordLink = null;
        shop.linkExpiresIn = null;
        shop.password = hashedPassword;
        await shop.save();
     
        res.status(200).json({
            success:true,
            msg:"Password succefully Updated"
        });

    } catch (error) {
        next(error);
    };
}