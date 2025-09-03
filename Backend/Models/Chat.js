const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    members:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: []
    },
    lastMessage:{
        type : String,
        default : ""
    },
    lastMessageAt : {
        type : Date,
        default : Date.now
    },
    unreadMessagesCount : {
        type : Map,
        of : Number,
    }

},{timestamps:true});

module.exports = mongoose.model('Chat',chatSchema);