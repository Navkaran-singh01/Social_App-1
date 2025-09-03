const { getSocketId } = require("../Jobs/mapSocketid");
const { sendMessage } = require("./chatControl");

exports.handleSendMessage = async (socket,io,data) => {
    try{
        const senderId = socket.user.id;
        const {receiverId, text,selectedChat} = data;
        console.log(data);
        console.log("Reciever id --> ",receiverId);
        const {message,updatedChatss,isInc} = await sendMessage({
            senderId,
            receiverId,
            text,
            // media,
            // mediaType,
            selectedChat
        })

        const receiverSocketId = getSocketId(receiverId);
        if(receiverSocketId){
            console.log("Receiver socket id is --> ",receiverSocketId);
            const updatedChats = updatedChatss.toObject();
            updatedChats.members = updatedChatss.members.filter((member) => member._id.toString() !== receiverId)
            io.to(receiverSocketId).emit("newMessage",message);
            io.to(receiverSocketId).emit("updateChats",updatedChats);
            io.to(receiverSocketId).emit("isInc",isInc);
        }
        const updatedChats = updatedChatss.toObject();
        updatedChats.members = updatedChatss.members.filter((member) => member._id.toString() !== senderId)
        socket.emit("newMessage",message);
        socket.emit("updateChats",updatedChats);
    }
    catch(error){
        socket.emit("error", { message: error.message });
    }
}