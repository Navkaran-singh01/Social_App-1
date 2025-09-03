const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    chatId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Chat',
        required: true,
    },
    senderId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required: true,
    },
    text : {
        type : String,
        trim:true
    },
    media : {
        type : String,
        default : ""
    },
    mediaType : {
        type : String,
        enum : ["","image","audio","video"],
        default : ""
    },
    readAt : {
        type : Date,
        default : null
    }

},{timestamps:true});

module.exports = mongoose.model('Message',messageSchema);