const mongoose = require('mongoose');
const User = require('./User');
const Post = require('./Post');

const likeSchema = new mongoose.Schema({
    post:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    likeBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},
{timestamps: true});
const Like = mongoose.model('Like', likeSchema);
module.exports = Like;
