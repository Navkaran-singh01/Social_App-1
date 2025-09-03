import React, { useEffect, useRef } from 'react'

const RemoteVideoCall = ({consumer,socketId}) => {
    const videoRef = useRef();

    useEffect(()=>{
        if(!consumer || !videoRef.current) return;
        console.log("Okay this is also running");
        const stream = new MediaStream();
        stream.addTrack(consumer.track);
        
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(err => console.log("The video of user is not playing socketId ",socketId ,"Error is : ",err));

        return ()=>{
            consumer.track.stop();
            // videoRef.current.srcObject = null;
        }
    },[consumer])

  if(consumer.track.kind === 'audio'){
    return (
      <div>
        
      </div>
    )
  }

  return (
    <video 
    ref={videoRef}
    id={`remote-${socketId}`}
    autoPlay
    playsInline
    muted = {consumer.track.kind === 'audio' ? false : true}
    style={{ width: "500px", height: "95%", backgroundColor: "#000" }}
    />
  )
}

export default RemoteVideoCall