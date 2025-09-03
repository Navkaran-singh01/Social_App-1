
//For the socket controllers we donot write try and catch because if error occurs we handle it in the io

const { getSocketId } = require("../Jobs/mapSocketid")
const Chat = require("../Models/Chat")
const Message = require("../Models/Message")

exports.sendMessage = async({ senderId, receiverId, text, media, mediaType ,selectedChat}) => {
    let chat = await Chat.findOne(
        {members : {$all : [senderId,receiverId]}}
    )
    console.log("The selected chat is --> ",selectedChat)
    if(!chat){
        chat = await Chat.create({
            members : [senderId,receiverId],
            unreadMessagesCount: {
                [senderId]: 0,
                [receiverId]: 0
            }
        })
    }

    let isInc = null;
    console.log(chat._id);
    console.log("This is the data ....")
    const message = await Message.create({
        chatId : chat._id,
        senderId,
        text,
        // media,
        // mediaType
    })
    console.log("This is the data ....")
    const currentUnread = chat.unreadMessagesCount.get(receiverId)||0;
    if(!getSocketId(receiverId) || selectedChat?._id !== chat._id.toString()){
        console.log("This is the data ....")
        chat.unreadMessagesCount.set(receiverId,currentUnread + 1);
        if(!currentUnread) isInc = chat._id;
    }
    // else{
    //     message.readAt = new Date();
    //     await message.save();
    // }
    console.log("This is the data ....")
    chat.lastMessage = text || (mediaType ? `${mediaType} file` : "");
    console.log("This is the last Message --> ",chat.lastMessage)
    chat.lastMessageAt = new Date();
    await chat.save();
    
    const updatedChatss = await chat.populate({
        path : "members",
        select : "_id username profilePicture"
    })
    //This convert it to object so that we can easily apply filter and other functionality 
    //If we donot do that there is problem with the populated stuff it donot come in the filter

    return {message,updatedChatss,isInc}
}