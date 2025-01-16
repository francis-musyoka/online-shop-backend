const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/error');
const db = require('../utils/database');

exports.isAuthenticated = async(req,res,next)=>{
    const{token} = req.cookies;
     try {
        if(!token){
            return next(new ErrorResponse('Access denied: You must Log in to access',401));
        };

        const verfyToken =  jwt.verify(token,process.env.TOKEN_SECRET);
        const user = await db.Customer.findOne({where:{
            id:verfyToken.id},
            attributes:['id','firstName','lastName','email'],
            // attributes:{exclude:['password','token','createdAt','updatedAt']}
            });

        if(!user){
            return next(new ErrorResponse("User not found", 404));
        };

        req.user = user;
        next();
        
        
     } catch (error) {
        if (error.name === "TokenExpiredError") {
            return next(new ErrorResponse("Session has expired. Please log in again.", 401));
          }
        next(error);
     }
   
}


exports.authenticateShop = async(req,res,next)=>{
    const{token} = req.cookies;
     try {
        if(!token){
            return next(new ErrorResponse('Access denied: You must Log in to access',401));
        };

        const verfyToken =  jwt.verify(token,process.env.SHOP_TOKEN_SECRET);
        const shopProfile = await db.Shop.findOne({where:{
            id:verfyToken.id},
            //attributes:['id','firstName','lastName','email'],
             attributes:{exclude:['password','accessToken','createdAt','updatedAt']}
            });

        if(!shopProfile){
            return next(new ErrorResponse("Shop not found", 404));
        };

        req.shop = shopProfile;
        next();
        
        
     } catch (error) {
        if (error.name === "TokenExpiredError") {
            return next(new ErrorResponse("Session has expired. Please log in again.", 401));
          }
        next(error);
     }
   
}