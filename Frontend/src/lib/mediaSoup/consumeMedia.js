import { useChatStore } from "../../Store/chat";
import { useMediaSoupStore } from "../../Store/mediaSoup";


export const consumeMedia = ({ chatId, recvTransport, producerId, device,socketId }) => {
    const socket = useChatStore.getState().socket;
    return new Promise ((resolve,reject)=>{
        const rtpCapabilities = device.rtpCapabilities;
        console.log("Now It is running")

        socket.emit("mediaSoup:consume",{
            chatId,
            transportId:recvTransport.id,
            producerId,
            rtpCapabilities
        },async(consumerParams)=>{
            if (consumerParams?.error) {
                return reject(consumerParams.error);
            }

            try{
                console.log("Is this running")
                const consumer = await recvTransport.consume(consumerParams)
                console.log("Before Adding the socketId");
                consumer.appData = {socketId};
                console.log("After adding the socketId");
                useMediaSoupStore.getState().addConsumer(consumer);
                resolve(consumer);
            }
            catch(err){
                console.error("Error creating consumer", err);
                reject(err);
            }
        })


    })
}