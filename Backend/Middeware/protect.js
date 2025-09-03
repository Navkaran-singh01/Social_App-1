const jwt = require('jsonwebtoken');
const cookie = require('cookie');

require('dotenv').config();

const protect = (req, res, next) => {
    try{
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Token is empty' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded) {
            return res.status(401).json({ message: 'Token is Invalid' });
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        console.error('Error in protect middleware:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const protectSocket = (io) => {
    io.use((socket,next)=>{
        try{
            const cookiess = cookie.parse(socket.request.headers.cookie || "");
            const token = cookiess?.token;

            if(!token){
                return next(new Error('Authentication error: No token'));
            }

            const user = jwt.verify(token,process.env.JWT_SECRET);
            if(!user){
                return next(new Error('Authentication error: Invalid token'));
            }
            socket.user = user;
            next();
        }
        catch(err){
            console.error('Socket auth error:', err.message);
            return next(new Error('Authentication error: Invalid token internal'));
        }
    })
}

module.exports = {protect,protectSocket}