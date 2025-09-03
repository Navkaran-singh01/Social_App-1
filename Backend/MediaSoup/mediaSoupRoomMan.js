const { mediaCodecs, transportOptions } = require("./mediaSoupConfig");
const { createWorker } = require("./mediaSoupServer");

let worker ;
async function initWorker() {
    if(!worker){
        worker = await createWorker();
    }
}
const rooms = new Map();

async function getOrCreateRoom(chatId) {
    await initWorker();
    if(rooms.has(chatId)){
        console.log("The room is already existed ");
        return rooms.get(chatId)
    }

    const router = await worker.createRouter({mediaCodecs});
    
    const room = {
        router,
        peers : {}
    }

    rooms.set(chatId,room);

    console.log("Room is created for chatId ",chatId);
    return room;
}

function getRoom(chatId){
    return rooms.get(chatId)
}

function removeRoom(chatId){
    rooms.delete(chatId)
}

async function createWebRtcTransport(room,socketId) {
    const {router,peers} = room;
    const transport = await router.createWebRtcTransport(transportOptions);

    transport.on("dtlsstatechange",(dtlsState)=>{
        if(dtlsState === "closed"){
            console.log("The transport is closed due to state change in dtls");
            transport.close();
        }
    })

    transport.on("close",()=>{
        console.log("Transport is closed");
    })

    if(!peers[socketId]){
        peers[socketId] = {
            transports : [],
            producers : [],
            consumers : []
        }
    }

    peers[socketId].transports.push(transport);
    return {
        transport ,
        params : {
            id: transport.id,
            iceParameters: transport.iceParameters,
            iceCandidates: transport.iceCandidates,
            dtlsParameters: transport.dtlsParameters,
        }
    }
}

function closePeer(room,socketId){
    const peer = room.peers[socketId];
    if(!peer) return;

    peer.transports.forEach(transport => {
        if(transport && !transport.closed) transport.close();
    });

    peer.producers.forEach(producer => {
        if(producer && !producer.closed) producer.close();
    });

    peer.consumers.forEach(consumer => {
        if(consumer && !consumer.closed) consumer.close();
    });

    delete room.peers[socketId];
}

module.exports = {
    getOrCreateRoom,
    getRoom,
    removeRoom,
    createWebRtcTransport,
    closePeer
}

