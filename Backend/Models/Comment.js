const mongoose = require('mongoose');
const User = require('./User');
const Post = require('./Post');

const commentSchema = new mongoose.Schema({
    post:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    commentBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    // replies: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Comment',
    //     default: []
    // }]

},{timestamps: true});
const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;