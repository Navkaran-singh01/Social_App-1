import React, { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { useUserDataStore } from '../Store/userData'
import VideoCallContainer from './VideoCall';
import { joinRoom } from '../lib/mediaSoup/joinRoom';
import { createSendTransport } from '../lib/mediaSoup/createSendTransport';
import { createRecvTransport } from '../lib/mediaSoup/createRecvTransport';
import { useMediaSoupStore } from '../Store/mediaSoup';

const IncomingCalls = ({setIsIncomingCall,IncomingCall}) => {
    const {setIncomingCall} = useUserDataStore();
    const {device} = useMediaSoupStore();
    const [isVideoCall,setIsVideoCall] = useState(false);
    const [acceptedCall,setAcceptedCall] = useState(false);
    const hanlerRejectCall =()=>{
        setIncomingCall(null);
        setIsIncomingCall(false);
    }
    const handleAcceptCall = async () => {
        if(!device) await joinRoom(IncomingCall.chatId);
        await createSendTransport(IncomingCall.chatId,IncomingCall.CallerDetail._id); 
        await createRecvTransport(IncomingCall.chatId);
        setIsVideoCall(true);
        setAcceptedCall(true);
    }

    useEffect(()=>{
        if(!isVideoCall && acceptedCall) hanlerRejectCall();
    },[isVideoCall])

    if(!IncomingCall){
        return (
            <div></div>
        )
    }
  return (
    <div className='fixed flex flex-col items-center justify-center bottom-8 right-20 w-[280px] bg-orange-500 rounded-lg h-[120px]  z-50' >
        <button className='text-gray-700 absolute top-2 right-4' onClick={hanlerRejectCall}>
            <X className="w-8 h-8"/>
        </button>
        <div>
            <div className="flex items-center  mb-2 px-5 space-x-2">
            <div className="w-[50px] h-[50px] rounded-full overflow-hidden flex-shrink-0 ">
                <img src={IncomingCall.CallerDetail.profilePicture} className="w-full h-full object-cover block rounded-full"></img>
            </div>
            <p className="font-bold text-sm">{IncomingCall.CallerDetail.username}</p>
            </div>
        </div>
        <button 
        onClick={handleAcceptCall}
        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-700 transition">
            Accept Call
        </button>
        {
            isVideoCall && 
            <VideoCallContainer setIsVideoCall = {setIsVideoCall} chatId = {IncomingCall.chatId}/>
        }
    </div>
  )
}

export default IncomingCalls