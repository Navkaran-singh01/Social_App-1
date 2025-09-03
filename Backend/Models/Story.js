const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
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
    contentType:{
        type:String,
        enum:["image","video"],
        required:true
    },
    caption: {
        type: String,
        default: ''
    },
    expiresAt: {
        type: Date,
        required: true
    },
    isArchived: {
        type: Boolean,
        default: false
    },
    likes:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default:[]
    }
},{timestamps:true});


module.exports = mongoose.model('Story',storySchema);