import React, { useEffect, useRef, useState } from 'react'
import { useDataStore } from '../Store/getData'
import { useUserDataStore } from '../Store/userData';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, X } from 'lucide-react';
import { useChatStore } from '../Store/chat';


const SearchChats = ({setIsSearchingChats}) => {
    const {getsearchUsers,searchChats,searchLoading,setSearchLoading,clearSearchChats,setOtherUserId} = useDataStore();
    const {userChats,setSelectedChat} = useChatStore();
    const {userData} = useUserDataStore();
    const [input,setInput] = useState('');
    const navigate = useNavigate();
    const timer = useRef(null);

    useEffect(()=>{
        if(timer.current) clearTimeout(timer.current);
        if(input.trim() !== ""){
            setSearchLoading(true);
        }
        else setSearchLoading(false);
        timer.current = setTimeout(()=>{
            if(input.trim() !== ""){
                getsearchUsers(input);
            }
            else {
                clearSearchChats();
            }
        },300);

        return ()=>{
            clearTimeout(timer.current);
        }
    },[input])

    const handleChatUser = (otherUser) => {
        const chatExist = userChats.find((chat)=> 
            chat.members.some((member) => member._id === otherUser._id)
        );
        if(chatExist){
            setSelectedChat(chatExist);
            setIsSearchingChats(false);
            navigate("/Chat")
        }
        else{
            const newChat = {
                members : [
                    {
                        _id : otherUser._id,
                        username : otherUser.username,
                        profilePicture : otherUser.profilePicture
                    }
                ]
            }
            setSelectedChat(newChat);
            setIsSearchingChats(false);
            navigate("/Chat")
        }
    }
  return (
        <div className="relative w-full rounded-lg  bg-white h-2/3 px-3 ">
            <button className='text-gray-700 absolute top-0 left-0' onClick={()=>setIsSearchingChats(false)}>
                <ChevronLeft className="w-9 h-9"/>
            </button>
            <input
            type='text'
            placeholder='Search Users...'
            className="w-11/12 px-4 py-2 border ml-7 rounded-lg focus:outline-none"
            name='searchInput'
            id='searchInput'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            />

            {
                input === '' 
                && searchChats.length === 0 &&
                <p className='absolute top-1/2 left-1/3 text-gray-400'>Search the User</p>
            }

            {
                input !== '' 
                && searchChats.length === 0 && !searchLoading &&
                <p className='absolute top-1/2 left-1/3 text-gray-400'>No User Found</p>
            }

            {searchLoading ? 
            <p className=" mt-4 p text-sm text-gray-500">Searching...</p>
            :
                searchChats.length > 0 && 
                <ul>
                    {searchChats.map((user) => (
                        <li
                        key={user._id}
                        onClick={()=>handleChatUser(user)}
                        className="cursor-pointer px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                        >
                            <img src={user.profilePicture} alt="pp" className="w-12 h-12 rounded-full object-cover" />
                            <div>
                                <p className="text-sm font-medium">{user.username}</p>
                                <p className="text-xs text-gray-500">{user.name}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            }
        </div>
  )
}

export default SearchChats