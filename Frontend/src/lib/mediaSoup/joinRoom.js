import * as mediasoupClient from "mediasoup-client";
import { useChatStore } from "../../Store/chat";
import { useMediaSoupStore } from "../../Store/mediaSoup";


export const joinRoom = async(chatId) => {
    const socket = useChatStore.getState().socket;

    if(!socket){
        console.error("The socket is not connected");
        return;
    }

    // By using a Promise, you allow error handling using try/catch in calling code.
    // And the socket.emit is setup the device it is like a work if it complete return resolve if not return reject

    return new Promise ((resolve,reject)=>{
        socket.emit("mediaSoup:joinRoom",{chatId},async({rtpCapabilities,existingUsers})=>{
            try{
                const device = new mediasoupClient.Device();
                await device.load({routerRtpCapabilities:rtpCapabilities});
                if(device.canProduce('video')){
                    console.log("The device is setup perfect and can produce video");
                }
                else {
                    console.error("The device is not setup correctly , it can't produce the video");
                    reject();
                }
                useMediaSoupStore.getState().setDevice(device);
                useMediaSoupStore.getState().setExistingUsers(existingUsers);
                resolve();
            }
            catch(err){
                console.error("Failed to load the device : ",err);
                reject(err)
            }
        })
    })
}