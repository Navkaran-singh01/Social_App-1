import { useChatStore } from "../../Store/chat"
import { useMediaSoupStore } from "../../Store/mediaSoup";

export const leaveCall = (chatId) => {
    const {socket} = useChatStore.getState();
    const {sendTransport,recvTransport,producers,consumers,resetMediaSoup} = useMediaSoupStore.getState();
    
    socket.emit("mediaSoup:leaveRoom",chatId);

    if(producers && producers.lenght > 0){
        for(const producer of producers){
            try{
                producer.close();
            }
            catch(err){
                console.log("Error while closing producer ")
            }
        }
    }

    if(consumers && consumers.lenght > 0){
        for(const consumer of consumers){
            try{
                consumer.close();
            }
            catch(err){
                console.log("Error while closing consumer ")
            }
        }
    }
    if (sendTransport) {
        try { 
            sendTransport.close(); 
        } catch(err) {
            console.log("Error while closing sendTransport ")
        }
    }
    if (recvTransport) {
        try { 
            recvTransport.close(); 
        } catch(err) {
            console.log("Error while closing recvTransport ")
        }
    }

    resetMediaSoup();
}