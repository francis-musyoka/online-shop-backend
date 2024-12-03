
const db = require('../utils/database');
const ErrorResponse = require('../utils/error');
const { validatePassword } = require('../utils/validate');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { generateToken,cookieOptions } = require('../utils');
const jwt = require('jsonwebtoken');


const {Customer} = db;

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

        const customer = await Customer.create({
            id: id,
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword
        });

        res.status(201).json({
                success : true,
                user: customer
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
    const {email,password} = req.body;
    try {
        const user = await Customer.findOne({where:{email:email}});

        if(!user){
            return next(new ErrorResponse('No user with this email', 404))
        };

        //VALIDATE PASSWORD
        const isPasswordValid = await bcrypt.compare(password,user.password);
        
        if(!isPasswordValid){
            return next(new ErrorResponse('Invalid credentials',401));
        };

        //generate token:
        const token = generateToken(user);

        //save token 
        await user.update({ token:token });
        
        res.status(200)
            .cookie('token', token, cookieOptions)
            .json({success: true, token});

    } catch (error) {
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