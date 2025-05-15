const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/error');
const db = require('../utils/database');

exports.isAuthenticated = async (req, res, next) => {
    const { token } = req.cookies;
    try {
        if (!token) {
            return res.status(401).json({ authenticated: false, message: 'Access denied: You must log in to access this resource.' });
        }

        const verfyToken = jwt.verify(token, process.env.TOKEN_SECRET);

        const user = await db.Customer.findOne({
            where: {
                id: verfyToken.id
            },
            attributes: ['id', 'firstName', 'lastName', 'email'],
        });

        if (!user) {
            return res.status(404).json({ authenticated: false, message: 'User not found.' });
        }

        req.user = user;
        next();


    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ authenticated: false, message: 'Session has expired. Please log in again.' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ authenticated: false, message: 'Invalid token. Please log in again.' });
        }
        next(error);
    }

}


exports.authenticateShop = async (req, res, next) => {
    const { shopToken } = req.cookies;
    try {
        if (!shopToken) {
            return res.status(401).json({ authenticated: false, message: 'Access denied: You must log in to access this resource.' });;
        };

        const verfyToken = jwt.verify(shopToken, process.env.SHOP_TOKEN_SECRET);
        const shopProfile = await db.Shop.findOne({
            where: {
                id: verfyToken.id
            },
            //attributes:['id','firstName','lastName','email'],
            attributes: { exclude: ['password', 'accessToken', 'forgotPasswordLink', 'linkExpiresIn', 'createdAt', 'updatedAt'] }
        });

        if (!shopProfile) {
            return res.status(404).json({ authenticated: false, message: 'Shop not found.' });
        };

        req.shop = shopProfile;
        next();


    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ authenticated: false, message: 'Session has expired. Please log in again.' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ authenticated: false, message: 'Invalid token. Please log in again.' });
        }
        next(error);
    }

};

