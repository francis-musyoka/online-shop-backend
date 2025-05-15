const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { sha512 } = require('js-sha512');
const axios = require('axios')


const db = require('./database');
const ErrorResponse = require('./error');
const { PRODUCTION, DEVELOPMENT } = require('../constants');

const { Wishlist, Cart, GuestCart, OrderCounter, sequelize } = db;


const createId = () => {
        const id = uuidv4().replace(/-/g, '');
        return id
};


const generateToken = (user) => {
        const payload = { id: user.id };
        const secretKey = process.env.TOKEN_SECRET;
        const tokenExpiresIn = Number(process.env.TOKEN_EXPIRES_IN) || '1d'
        console.log("tokenExpiresIn:::::::=>", tokenExpiresIn);

        const token = jwt.sign(payload, secretKey, { expiresIn: tokenExpiresIn });

        return token;
};

const generateForgotPasswordToken = (user) => {
        const payload = { id: user.id };
        const secretKey = process.env.TOKEN_SECRET;
        const tokenExpiresIn = Number(process.env.FORGOT_PASSWORD_TOKEN_EXPIRES_IN) || '10m'
        const token = jwt.sign(payload, secretKey, { expiresIn: tokenExpiresIn });

        return token;
}

const domain = process.env.COOKIE_DOMAIN
const domainHostName = domain ? new URL(domain).hostname : undefined;

const cookieOptions = {
        httpOnly: process.env.COOKIE_HTTP_ONLY,
        secure: process.env.COOKIE_SECURE,
        sameSite: process.env.COOKIE_SAME_SITE,
        domain: domainHostName,
};


const generateResetToken = async (user) => {
        const token = createId();

        const hashedToken = sha512(token);
        const linkExpiration = new Date(Date.now() + 10 * 60 * 1000);

        user.forgotPasswordLink = hashedToken;
        user.linkExpiresIn = linkExpiration;
        await user.save();


        // Send the raw token to the user in the link
        return `${PRODUCTION.FRONT_END_URL ?? DEVELOPMENT.FRONT_END_URL}/reset-password/${token}`
};

const generateResetShopToken = async (shop) => {
        const token = createId();

        const hashedToken = sha512(token);
        const linkExpiration = new Date(Date.now() + 10 * 60 * 1000);

        shop.forgotPasswordLink = hashedToken;
        shop.linkExpiresIn = linkExpiration;
        await shop.save();


        // Send the raw token to the user in the link

        return `$${PRODUCTION.FRONT_END_URL ?? DEVELOPMENT.FRONT_END_URL}/sell/reset-password/${token}`
};

const generateLogInShopToken = async (shop) => {
        const payload = { id: shop.id };
        const secretKey = process.env.SHOP_TOKEN_SECRET;
        const tokenExpiresIn = Number(process.env.SHOP_TOKEN_EXPIRES_IN) || '1d'

        const token = jwt.sign(payload, secretKey, { expiresIn: tokenExpiresIn });

        return token;
};


//Wishlist Functions
const addWishlist = async (productId, customerId) => {

        const id = createId();

        await Wishlist.create({
                id: id,
                customerId: customerId,
                productId: productId
        });

};

const removeWishList = async (productId, customerId) => {

        await Wishlist.destroy({
                where: {
                        customerId: customerId,
                        productId: productId
                }
        });

}


const mergeGuestCart = async (guestId, customerId, transaction, next) => {
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
                                        { id: createId(), customerId: customerId, productId: productId, quantity: quantity },
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


const generateStkPushPassword = () => {
        const shortcode = process.env.MPESA_SHORTCODE;
        const passkey = process.env.MPESA_PASSKEY;
        const timeStamp = new Date().toISOString().replace(/[^0-9]/g, "").slice(0, 14);
        const password = Buffer.from(`${shortcode}${passkey}${timeStamp}`).toString('base64');
        return [password, timeStamp]
};

const getStkPushAccessToken = async () => {
        const { data } = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
                auth: {
                        username: process.env.MPESA_CONSUMER_KEY,
                        password: process.env.MPESA_CONSUMER_SECRET
                }
        });
        return data.access_token
};

const generateOrderNumber = async () => {
        return await sequelize.transaction(async (t) => {
                let currentCount = null;

                const counter = await OrderCounter.findOne({
                        where: { id: 1 },
                        transaction: t,
                });

                if (counter) {
                        currentCount = counter.count + 1
                        counter.count = currentCount;
                        await counter.save({ transaction: t });
                } else {
                        await OrderCounter.create({
                                id: 1,
                                count: 100000,
                                transaction: t
                        });
                        currentCount = 100000;
                };

                const now = new Date();
                const year = now.getFullYear().toString().slice(-2);
                const month = (now.getMonth() + 1).toString().padStart(2, '0');
                const day = (now.getDate().toString().padStart(2, "0"))
                const randomTwo = Math.floor(Math.random() * 90 + 10);

                const orderNumber = `RF${year}${month}${day}${currentCount}${randomTwo}`

                return orderNumber;

        });
};


module.exports = {
        createId, cookieOptions, generateToken, generateForgotPasswordToken,
        generateLogInShopToken, generateResetShopToken, generateResetToken, addWishlist,
        removeWishList, mergeGuestCart, generateStkPushPassword, getStkPushAccessToken,
        generateOrderNumber
}


