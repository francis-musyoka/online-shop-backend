const jwt = require('jsonwebtoken');
exports.generateToken = (user)=>{
        const payload = {id: user.id};
        const secretKey = process.env.TOKEN_SECRET;
        const tokenExpiresIn =Number(process.env.TOKEN_EXPIRES_IN) || '1d'

        const token = jwt.sign(payload,secretKey,{expiresIn: tokenExpiresIn});

        return token;
}

exports.cookieOptions ={
        httpOnly: process.env.COOKIE_HTTP_ONLY || true,
        secure: process.env.COOKIE_SECURE || true,
        sameSite: process.env.COOKIE_SAME_SITE || 'Lax',
}







