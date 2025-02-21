const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const {sha512} = require('js-sha512');



const db = require('./database');
const ErrorResponse = require('./error');

const {Wishlist,Cart,GuestCart} = db;


const createId = ()=>{
        const id = uuidv4().replace(/-/g, '');
        return id
};


const generateToken = (user)=>{
        const payload = {id: user.id};
        const secretKey = process.env.TOKEN_SECRET;
        const tokenExpiresIn =Number(process.env.TOKEN_EXPIRES_IN) || '1d'

        const token = jwt.sign(payload,secretKey,{expiresIn: tokenExpiresIn});

        return token;
};

const generateForgotPasswordToken =(user)=>{
        const payload = {id: user.id};
        const secretKey = process.env.TOKEN_SECRET;
        const tokenExpiresIn =Number(process.env.FORGOT_PASSWORD_TOKEN_EXPIRES_IN) || '10m'
        const token = jwt.sign(payload,secretKey,{expiresIn: tokenExpiresIn});

        return token;
}

const cookieOptions ={
        httpOnly: process.env.COOKIE_HTTP_ONLY || true,
        secure: process.env.COOKIE_SECURE || true,
        sameSite: process.env.COOKIE_SAME_SITE || 'Lax',
};


const generateResetToken = async (user) => {
        const token = createId();
        
        const hashedToken = sha512(token); 
        const linkExpiration = new Date(Date.now() + 10 * 60 * 1000);

        user.forgotPasswordLink = hashedToken;
        user.linkExpiresIn = linkExpiration;
        await user.save();
        
    
        // Send the raw token to the user in the link
        return `http://localhost:3000/reset-password/${token}`;
};

const generateResetShopToken = async (shop) => {
        const token = createId();
        
        const hashedToken = sha512(token); 
        const linkExpiration = new Date(Date.now() + 10 * 60 * 1000);

        shop.forgotPasswordLink = hashedToken;
        shop.linkExpiresIn = linkExpiration;
        await shop.save();
        
    
        // Send the raw token to the user in the link
        return `http://localhost:3000/sell/reset-password/${token}`;
};

const generateLogInShopToken = async (shop)=>{
        const payload = {id: shop.id};
        const secretKey = process.env.SHOP_TOKEN_SECRET;
        const tokenExpiresIn =Number(process.env.SHOP_TOKEN_EXPIRES_IN) || '2d'

        const token = jwt.sign(payload,secretKey,{expiresIn: tokenExpiresIn});

        return token;
};
    

//Wishlist Functions
const addWishlist = async(productId, customerId)=>{

        const id = createId();

        await Wishlist.create({
                id: id,
                customerId:customerId,
                productId: productId
        });

};

const removeWishList = async(productId,customerId)=>{

        await Wishlist.destroy({
                where:{
                customerId:customerId,
                productId: productId
                }
        });
        
}


const mergeGuestCart = async (guestId, customerId, transaction,next) => {
        console.log("DOING MAGIC IN:::", guestId);
        
        try {
            // Fetch guest cart items
            const guestCartProduct = await GuestCart.findAll({ where: { guestId } });
    
            if (guestCartProduct.length === 0) return; // No items to merge
    
            console.log('.............GOSH!');
            
            // Fetch user's cart items
            const userCartItems = await Cart.findAll({ where: { customerId } });
    
            // Convert user cart to a map for easy lookup
            const userCartMap = new Map(userCartItems.map(item => [item.productId, item]));
    
            // Iterate over guest cart items
            for (const guestItem of guestCartProduct) {
                const { productId, quantity } = guestItem;
    
                if (userCartMap.has(productId)) {
                    // If product exists, update the quantity
                    await Cart.update(
                        { quantity: userCartMap.get(productId).quantity + quantity },
                        { where: { customerId, productId }, transaction },
                        
                    );
                } else {
                    // If product doesn't exist, insert it
                    await Cart.create(
                        { id: createId(), customerId:customerId, productId:productId, quantity:quantity },
                        { transaction }
                    );
                }
            }
    
            // Delete guest cart items after merging
            await GuestCart.destroy({ where: { guestId }, transaction });
    
        } catch (error) {
            next(error);
        }
    };
    



module.exports = {
        createId,cookieOptions, generateToken,generateForgotPasswordToken,
        generateLogInShopToken,generateResetShopToken,generateResetToken,addWishlist,
        removeWishList, mergeGuestCart
}



