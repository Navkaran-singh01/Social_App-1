import { useChatStore } from "../../Store/chat"
import { useMediaSoupStore } from "../../Store/mediaSoup";
import { consumeMedia } from "./consumeMedia";


export const createRecvTransport = async (chatId) => {
    const socket = useChatStore.getState().socket;
    const device = useMediaSoupStore.getState().device;
    const existingUsers = useMediaSoupStore.getState().existingUsers;

    return new Promise ((resolve,reject)=>{
        socket.emit("mediaSoup:createTransport",{chatId,direction : 'recv'},async(transportOptions)=>{
            try{
                const recvTransport = await device.createRecvTransport(transportOptions);

                //now we are connecting with the server using transport.on (connect)
                //In which we are socket.emit(connect) means it return callback to transport that we connected to server
                recvTransport.on("connect",({dtlsParameters},callback,errback)=>{
                    socket.emit("mediaSoup:connectTransport",{
                        dtlsParameters,
                        chatId,
                        transportId:recvTransport.id
                    },callback)
                })

                recvTransport.on("connectionstatechange", (state) => {
                    console.log("recv transport state:", state);
                });

                useMediaSoupStore.getState().setRecvTransport(recvTransport);

                for(const existingUser of existingUsers){
                    const consumer = await consumeMedia({
                        chatId,
                        recvTransport,
                        device,
                        producerId : existingUser.producerId,
                        socketId : existingUser.socketId
                    })
                }
                resolve(recvTransport);
            }
            catch(error){
                console.error("Error creating recv transport:", error);
                reject(error);
            }
        })
    })
}