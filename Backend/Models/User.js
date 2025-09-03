const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        password: {
            type: String,
            required: true
        },
        profilePicture: {
            type: String,
            default: 'https://res.cloudinary.com/dr99qbotj/image/upload/v1754397193/Social_app/vijsxzqkff71z9wsutmn.jpg'
        },
        bio: {
            type: String,
            default: ''
        },
        followers: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'User',
            default: []
        },
        following: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'User',
            default: []
        },
        posts: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Post',
            default: []
        },
        privacy: {
            type: String,
            enum: ['public', 'private'],
            default: 'public'
        },
        storys: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Story',
            default: []
        },
        savedPosts: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Post',
            default: []
        },
        comments: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Post',               //There should be Comments
            default: []
        },
        likes: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Post',              //There should be Likes
            default: []
        },
        followRequests:{
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'User',
            default: []
        }
    },
    { timestamps: true
    }
);
const User = mongoose.model('User', userSchema);
module.exports = User;