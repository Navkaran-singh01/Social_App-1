import React, { useEffect, useRef, useState } from 'react'
import { useChatStore } from '../Store/chat'
import { useNavigate } from 'react-router-dom';
import { useDataStore } from '../Store/getData';
import { useUserDataStore } from '../Store/userData';
import { Smile, Video } from 'lucide-react';
import VideoCall from './VideoCall';
import { useMediaSoupStore } from '../Store/mediaSoup';
import { joinRoom } from '../lib/mediaSoup/joinRoom';
import { createSendTransport } from '../lib/mediaSoup/createSendTransport';
import { createRecvTransport } from '../lib/mediaSoup/createRecvTransport';


const ChatWithUser = () => {
    const {selectedChat,getMessagesWithUser,messages,sendNewMessage} = useChatStore();
    const {userData} = useUserDataStore();
    const {setOtherUserId} = useDataStore();
    const {device} = useMediaSoupStore();
    const [newMessage,setNewMessage] = useState('');
    const [isVideoCall,setIsVideoCall] = useState(false);

    const containerRef = useRef(null);

    const navigate = useNavigate();

    useEffect(()=>{
        console.log("This is the selected Chat --> ",selectedChat);
        getMessagesWithUser(selectedChat._id);
    },[selectedChat])

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [messages]); // Runs when messages change

    useEffect(()=>{
        console.log("Now it is run ...")
    },[])

    const otherUserHandler = () => {
        // if(post.userid._id === userData._id){
        //     navigate('/Profile')
        //     return;
        // }
        setOtherUserId(selectedChat.members[0]._id);
        // navigate('/OtherUserProfile/:otherUserid'); --> This is needed when you want to search the user
        navigate('/OtherUserProfile');
    }

    const handleNewMessage = () => {
        sendNewMessage(newMessage);
        setNewMessage('');
    }

    const handleVideoCall = async() => {
        if(!device) await joinRoom(selectedChat._id);
        await createSendTransport(selectedChat._id,selectedChat.members[0]._id); 
        await createRecvTransport(selectedChat._id);
        setIsVideoCall(true);
    }
  return (
    <div className='w- flex flex-col  h-full '>
        {/* Other User Profile (Other functionality can be added like video call icon)*/}
        <div className='flex items-center justify-between w-full  p-2  space-x-2 border-b-2'>
            <div className="flex items-center  mb-2 px-5 space-x-2">
            <div className="w-[50px] h-[50px] rounded-full overflow-hidden flex-shrink-0 ">
                <img src={selectedChat.members[0].profilePicture} className="w-full h-full object-cover block rounded-full"></img>
            </div>
            <button className="font-bold text-sm" onClick={otherUserHandler}>{selectedChat.members[0].username}</button>
            </div>
            <button className="flex items-center  mb-2 px-5 space-x-2" onClick={handleVideoCall}>
                <Video className="w-8 h-8"/>
            </button>
        </div>

        <div ref = {containerRef} className='flex flex-col items-center w-full  h-4/5 overflow-y-auto will-change-transform p-2 border-b-2'>
            {/* It is also for Other User Profile 
            but it will not be appear all the time it will be at the top of the div */}
            <div className='w-full p-2'>
                <div className="flex flex-col justify-center items-center w-full mb-2 px-5 space-y-2">
                    <div className="w-[100px] h-[100px] rounded-full overflow-hidden flex-shrink-0 ">
                        <img src={selectedChat.members[0].profilePicture} className="w-full h-full object-cover block rounded-full"></img>
                    </div>
                    <p className="font-bold text" >{selectedChat.members[0].username}</p>
                    <button onClick={otherUserHandler} 
                    className="bg-gray-200 px-3 py-2 text-sm font-bold rounded-lg hover:bg-gray-300 transition"
                    >
                        View Profile
                    </button>
                </div>
            </div>
            {/* This div is for the messages */}
            <div className='w-full space-y-1 p-2 '>
                {
                    messages.length > 0 ?
                    (
                        messages.map((message)=>(
                            message.senderId === userData._id ?
                            (
                                // w-2/5
                                <div key={message._id} className='w-full flex flex-col justify-center items-end '>
                                    <p className='p-2 px-4 text-white bg-blue-500 max-w-sm text-right rounded-l-3xl rounded-r-xl'>{message.text}</p>
                                </div>
                            )
                            :
                            (
                                // w-2/5
                                <div key={message._id} className='w-full flex flex-col justify-center items-start'>
                                    <p className='p-2 px-4 text-white bg-blue-500 max-w-sm  rounded-r-3xl rounded-l-xl'>{message.text}</p>
                                </div>
                            )
                        ))
                    )
                    :
                    (
                        <div>
                            Start the Conversation
                        </div>
                    )
                }
            </div>
        </div>
        {/* This div is for to send the message */}
        <div className="flex items-center w-full p-3 border-t bg-white">
            <div className='flex items-center w-full p-3 rounded-full border-2 bg-white'>
            <Smile className="w-6 h-6 text-black" />

            <input
            type="text"
            placeholder="Add a comment..."
            className="flex-1 mx-4 border-none outline-none text-sm placeholder-gray-500 bg-transparent"
            value={newMessage} onChange={(e)=>{setNewMessage(e.target.value)}}
            />

            <button className="text-sm font-semibold text-blue-400 hover:text-blue-500 transition" onClick={handleNewMessage}>
                Post
            </button>
            </div>
        </div>
        {
            isVideoCall && 
            <VideoCall setIsVideoCall = {setIsVideoCall} chatId = {selectedChat._id}/>
        }
    </div>
  )
}

export default ChatWithUser