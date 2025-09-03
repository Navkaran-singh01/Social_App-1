const jwt = require('jsonwebtoken');
require('dotenv').config();
require('cookie-parser');

exports.generateToken = (payload,res) => {
    try{
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
       })
       return token;
    } catch(err) {
        console.error(err);
        return res.status(500).json({
            success:false,
            message:"Error while generating token "
        })
    }
}