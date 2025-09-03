const User = require('../Models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateToken } = require('../config/lib');

exports.signup = async (req, res) => {
    try{
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.find({ $or: [{ username }, { email }] });
        if(existingUser.length > 0) {  
            if(email !== existingUser[0].email) {
                return res.status(400).json({ message: 'Username is already existed' });
            }
            return res.status(400).json({ message: 'User already exists' });
        }
        if(!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create new user
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        });
        // Generate JWT token
        const payload = {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email
        };
        const token = generateToken(payload, res);
        if(!token) {
            return res.status(500).json({ message: 'Error generating token' });
        }
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email
            }
        });
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        // Find user by email
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // Generate JWT token
        const payload = {
            id: user._id,
            username: user.username,
            email: user.email
        };
        const token = generateToken(payload, res);
        if(!token) {
            return res.status(500).json({ message: 'Error generating token' });
        }
        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.logout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
}
