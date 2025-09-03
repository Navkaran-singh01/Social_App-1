import React, { useEffect, useRef, useState } from 'react'
import { useMediaSoupStore } from '../Store/mediaSoup';
import { createSendTransport } from '../lib/mediaSoup/createSendTransport';

const LocalVideoCall = ({chatId,isConsumer}) => {
    const videoRef = useRef();
    const [stream,setStream] = useState();
    const {sendTransport,addProducer} = useMediaSoupStore();

    const init = async () => {
        if(!chatId) return;
        try{
            let transport = sendTransport;
            if(!transport){
                transport = await createSendTransport();
            }

            const localStream = await navigator.mediaDevices.getUserMedia({
                video : true,
                audio : true
            });
            setStream(localStream);

            const videoTrack = localStream.getVideoTracks()[0];
            const audioTrack = localStream.getAudioTracks()[0];

            const videoProducer = await transport.produce({track: videoTrack});
            addProducer(videoProducer);

            const audioProducer = await transport.produce({track : audioTrack});
            addProducer(audioProducer);
        }
        catch(err){
            console.error("Local media init error:", err);
        }
    }
    useEffect(()=>{
        init();
    },[chatId]);

    useEffect(()=>{
        if(!stream || !videoRef.current) return ;
        console.log("THE Video track is")
        const videoTrack = stream.getVideoTracks()[0];
        const mediaStream = new MediaStream();
        mediaStream.addTrack(videoTrack);

        videoRef.current.srcObject = mediaStream;
        videoRef.current.play().catch(err => console.log("Error while streaming local Video",err));

        return ()=>{
            stream.getTracks().forEach(track => 
                track.stop()
            );
        }

    },[stream])


  return (
    <video 
    ref={videoRef}
    autoPlay
    muted
    playsInline
    style={{ width:isConsumer ? "250px" : "600px", height: isConsumer ? "180px" : "100%", backgroundColor: "#000" }}
    />
  )
}

export default LocalVideoCall