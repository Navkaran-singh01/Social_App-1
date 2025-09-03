const mongoose = require('mongoose');
const Like = require('./Like');
const User = require('./User');
const Comment = require('./Comment');

const postSchema = new mongoose.Schema({
    userid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    caption: {
        type: String,
        default: ''
    },
    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Like',
        default: []
    },
    comments: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Comment',
        default: []
    },
    savedBy: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: []
    }

}, {timestamps: true});
const Post = mongoose.model('Post', postSchema);
module.exports = Post;