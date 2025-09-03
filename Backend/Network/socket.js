const express = require('express');
const {Server} = require('socket.io');
const http = require('http');
const { protectSocket } = require('../Middeware/protect');
const { addUserSocket, removeUserSocket, getOnlineUsers, getSocketId } = require('../Jobs/mapSocketid');
const { handleSendMessage } = require('../Controller/socketChatControl');
const { createWorker } = require('../MediaSoup/mediaSoupServer');
const { getOrCreateRoom, createWebRtcTransport, getRoom, closePeer } = require('../MediaSoup/mediaSoupRoomMan');
const app = express();

const server = http.createServer(app);       //This is to connect using http {Without Socket express do it internally}
const io = new Server(server,{
    cors:{
      origin: [process.env.CLIENT_URL,"http://localhost:3001"],
      credentials: true
    }
});

async function InitMediaSoup(){
    await createWorker()
}
InitMediaSoup();

//MiddleWare for the authentication and to get the user payload from the cookie
protectSocket(io);

io.on('connection',(socket)=>{
    console.log("User is connected --> ",socket.id);
    const userId = socket.user.id;
    addUserSocket(userId,socket.id);

    const onlineuser = getOnlineUsers();
    io.emit("onlineUsers",onlineuser);

    //These are for the mediasoup 

    // In this we get the rtpcapabilites to create the device at the client side 
    // so there will not be compatibilty issue 
    // we get these from router mediasoupcodecs which if already created or we create with the chatId
    socket.on("mediaSoup:joinRoom",async({chatId},callback)=>{
        const room = await getOrCreateRoom(chatId);
        socket.join(chatId);

        const existingUsers = [];
        for(const [peerId, peer] of Object.entries(room.peers)){
            console.log("These are the existing users",peerId , " and its value is ",peer);
            for(const producer of peer.producers){
                existingUsers.push({
                    producerId:producer.id,
                    kind:producer.kind,
                    socketId:peerId
                })
            }
        }

        callback({
            rtpCapabilities:room.router.rtpCapabilities,
            existingUsers
        });
    })

    // This is to create the Transport for particular user either for send or receive (direction defines that)
    // So we can produce or consume on that transport 
    // And this store in particular room's peers[socketId].transports (there are particulary two send and reveive)
    // With peers[socketId] It is to track every user for their tranports,produces,consumes
    // When we create the transport here we pass the parameters to user so the user can also create the transport 
    // Basically in this there are the transportId and ices But the main thing is dtlsParameters 
    // are half at the backend for particular transport and completed when the user send the dtlsParameters in the connectTransprt
    socket.on("mediaSoup:createTransport",async({chatId,direction},callback)=>{
        const room = await getOrCreateRoom(chatId);
        const {transport , params} = await createWebRtcTransport(room,socket.id);

        transport.appData = {direction}


        callback(params);
    })

    // This is for to connect the particular transport (transportId) by giving the dtlsParamter
    socket.on("mediaSoup:connectTransport",async({chatId,transportId,dtlsParameters},callback)=>{
        const room = getRoom(chatId)
        const peer = room.peers[socket.id];

        const transport = peer.transports.find( t => t.id === transportId);
        if(!transport) return callback({error : "The Transport not found "});

        await transport.connect({dtlsParameters});
        callback("connected");
    });

    // This is to produce the stream from the particular user 
    // identify by the transportId 
    socket.on("mediaSoup:produce",async({chatId,transportId,kind,rtpParameters,otherPerson,myDetails},callback)=>{
        const room = getRoom(chatId);
        const peer = room.peers[socket.id];

        const sendTransport = peer.transports.find(t => t.id === transportId && t.appData.direction === "send");
        if(!sendTransport) return callback({error:"The send Transport is not found"});

        const producer = await sendTransport.produce({kind,rtpParameters});
        peer.producers.push(producer);

        socket.to(chatId).emit("mediaSoup:newProducer",{
            producerId:producer.id,
            kind,
            socketId:socket.id
        });

        const otherPersonId = getSocketId(otherPerson);
        if(otherPersonId && !room.peers[otherPersonId] ){
            io.to(otherPersonId).emit("mediaSoup:IncomingCall",({
                CallerDetail : myDetails,
                chatId
            }))
        } 

        callback({id : producer.id});
    })

    socket.on("mediaSoup:consume",async({chatId,producerId,rtpCapabilities,transportId },callback)=>{
        const room = getRoom(chatId);
        const peer = room.peers[socket.id];

        if(!room.router.canConsume({ producerId, rtpCapabilities })){
            return callback({error : "Cannot consume this produce"});
        }

        const recvTransport = peer.transports.find(t => t.id === transportId && t.appData.direction === "recv");
        if (!recvTransport) return callback({ error: "Receive transport not found" });

        const consumer = await recvTransport.consume({
            producerId,
            rtpCapabilities,
            paused:false
        })

        peer.consumers.push(consumer);
        console.log("This is consuming");

        return callback({
            id:consumer.id,
            producerId,
            kind:consumer.kind,
            rtpParameters : consumer.rtpParameters
        });
    });

    socket.on("mediaSoup:leaveRoom",(chatId)=>{
        const room = getRoom(chatId);
        if(!room) return;
        console.log("This is leaving the room")

        closePeer(room , socket.id);
        socket.leave(chatId);
        socket.to(chatId).emit("mediaSoup:userLeft",{socketId:socket.id});
    })

    //These are for the real time chatting
    socket.on("sendMessage",(data)=>{
        //for testing with postman can be removed when real frontend call
        if (typeof data === "string") {
        try {
            data = JSON.parse(data);
        } catch (err) {
            console.error("Invalid JSON received:", err);
            return;
        }
        }
        handleSendMessage(socket,io,data)
    });

    socket.on("disconnect",()=>{
        console.log("The user is disconnected --> ",socket.id);
        removeUserSocket(userId);
        const onlineuser = getOnlineUsers();
        io.emit("onlineUsers",onlineuser);
    })

})


module.exports = {server,app}