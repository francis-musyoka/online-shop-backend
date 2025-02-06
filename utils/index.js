const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const {sha512} = require('js-sha512');

const db = require('./database');
const {Wishlist} = db;

exports.generateToken = (user)=>{
        const payload = {id: user.id};
        const secretKey = process.env.TOKEN_SECRET;
        const tokenExpiresIn =Number(process.env.TOKEN_EXPIRES_IN) || '1d'

        const token = jwt.sign(payload,secretKey,{expiresIn: tokenExpiresIn});

        return token;
};

exports.generateForgotPasswordToken =(user)=>{
        const payload = {id: user.id};
        const secretKey = process.env.TOKEN_SECRET;
        const tokenExpiresIn =Number(process.env.FORGOT_PASSWORD_TOKEN_EXPIRES_IN) || '10m'
        const token = jwt.sign(payload,secretKey,{expiresIn: tokenExpiresIn});

        return token;
}

exports.cookieOptions ={
        httpOnly: process.env.COOKIE_HTTP_ONLY || true,
        secure: process.env.COOKIE_SECURE || true,
        sameSite: process.env.COOKIE_SAME_SITE || 'Lax',
};


exports.generateResetToken = async (user) => {
        const token = uuidv4().replace(/-/g, '');
        console.log(token);
        
        const hashedToken = sha512(token); 
        const linkExpiration = new Date(Date.now() + 10 * 60 * 1000);

        user.forgotPasswordLink = hashedToken;
        user.linkExpiresIn = linkExpiration;
        await user.save();
        
    
        // Send the raw token to the user in the link
        return `http://localhost:3000/reset-password/${token}`;
};

exports.generateResetShopToken = async (shop) => {
        const token = uuidv4().replace(/-/g, '');
        
        const hashedToken = sha512(token); 
        const linkExpiration = new Date(Date.now() + 10 * 60 * 1000);

        shop.forgotPasswordLink = hashedToken;
        shop.linkExpiresIn = linkExpiration;
        await shop.save();
        
    
        // Send the raw token to the user in the link
        return `http://localhost:3000/sell/reset-password/${token}`;
};

exports.generateLogInShopToken = async (shop)=>{
        const payload = {id: shop.id};
        const secretKey = process.env.SHOP_TOKEN_SECRET;
        const tokenExpiresIn =Number(process.env.SHOP_TOKEN_EXPIRES_IN) || '2d'

        const token = jwt.sign(payload,secretKey,{expiresIn: tokenExpiresIn});

        return token;
};
    

//Wishlist Functions
exports.addWishlist = async(productId, customerId)=>{

        const id = uuidv4().replace(/-/g,'');

        await Wishlist.create({
                id: id,
                customerId:customerId,
                productId: productId
        });

};

exports.removeWishList = async(productId,customerId)=>{

        await Wishlist.destroy({
                where:{
                customerId:customerId,
                productId: productId
                }
        });
        
}



