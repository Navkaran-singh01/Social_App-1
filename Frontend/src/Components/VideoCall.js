import React, { useEffect, useRef } from 'react'
import { useMediaSoupStore } from '../Store/mediaSoup'
import RemoteVideoCall from './RemoteVideoCall';
import { X } from 'lucide-react';
import LocalVideoCall from './LocalVideoCall';
import { leaveCall } from '../lib/mediaSoup/leaveCall';

const VideoCallContainer = ({setIsVideoCall,chatId}) => {
    const {consumers} = useMediaSoupStore();
    const timeoutRef = useRef();

      // Start 15s timer on mount to auto-close if no consumers join
    useEffect(() => {
        if (consumers.length === 0) {
            timeoutRef.current = setTimeout(() => {
                handleCloseCall();
            }, 15000); // 15 seconds
        }

        return () => {
            clearTimeout(timeoutRef.current); // Cleanup on unmount
        };
    }, []);

    // Cancel timeout if any consumer joins
    useEffect(() => {
        if (consumers.length > 0 && timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        
    }, [consumers]); 
    
    const handleCloseCall = () => {
        leaveCall(chatId)
        setIsVideoCall(null)
    }
  return (
    <div className='fixed inset-0 bg-zinc-900 flex  items-center justify-center z-50'>
        <h1 className="absolute top-5 left-5 text-[40px] text-white" style={{ fontFamily: 'Billabong, sans-serif' }}>
            SocialApp
        </h1>
        <div className='flex flex-wrap h-full p-5 gap-5'>
            {
                consumers.length > 0 ?
                consumers.map((consumer)=>(
                    <RemoteVideoCall key={consumer.id} consumer = {consumer} socketId = {consumer.appData.socketId}/>
                ))
                :
                (
                    <div>
                        <p>No user found</p>
                    </div>
                )
            }
        </div>
        <button onClick={handleCloseCall}
                className="absolute top-4 right-4 text-white text-2xl">
            <X className='w-8 h-8'/>
        </button>
        <div className='absolute top-4 right-16 text-white h-5/6'>
            <LocalVideoCall chatId={chatId} isConsumer = {consumers.length > 0}/>
        </div>
    </div>
  )
}

export default VideoCallContainer