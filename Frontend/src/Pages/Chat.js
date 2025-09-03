import React, { useEffect, useState } from 'react'
import SearchChats from '../Components/SearchChats'
import { useUserDataStore } from '../Store/userData'
import { useNavigate } from 'react-router-dom';
import { useDataStore } from '../Store/getData';
import { useChatStore } from '../Store/chat';
import { formatDistanceToNowStrict } from 'date-fns';
import ChatWithUser from '../Components/ChatWithUser';

const Chat = () => {
  const {setOtherUserId} = useDataStore();
  const {selectedChat,setSelectedChat,getUserChats,userChats,onlineUser} = useChatStore();
  const {userData} = useUserDataStore();
  const [isSearchingChats,setIsSearchingChats] = useState(false);
  const navigate = useNavigate();

  useEffect(()=>{
    getUserChats();
  },[])
  
    const handleUser = (otherUserID) => {
        if(otherUserID === userData._id){
            navigate('/Profile')
            return;
        }
        setOtherUserId(otherUserID);
        // navigate('/OtherUserProfile/:otherUserid'); --> This is needed when you want to search the user
        navigate('/OtherUserProfile');
    }

    function getCustomTimeAgo(dateString) {
      const raw = formatDistanceToNowStrict(new Date(dateString)); // e.g., "2 hours"
      return raw
        .replace('hours', 'hr')
        .replace('hour', 'hr')
        .replace('minutes', 'min')
        .replace('minute', 'min')
        .replace('seconds', 'sec')
        .replace('second', 'sec')
        .replace('days', 'day')
        .replace('day', 'day')
        .replace('months', 'month')
        .replace('month', 'month')
        .replace('years', 'yr')
        .replace('year', 'yr');
    }
  return (
    <div className="flex items-center justify-end w-full h-screen  rounded-lg shadow-lg pl-[250px]">
        <div className='h-full relative rounded-lg  bg-white px-5 w-1/3 pt-16 border-r-2'>
          <div className="flex items-center w-full mb-5 space-x-2">
            <div className="w-[80px] h-[80px] rounded-full overflow-hidden flex-shrink-0 ">
                <img src={userData.profilePicture} className="w-full h-full object-cover block rounded-full"></img>
            </div>
            <button className="font-bold text-2xl" onClick={()=>handleUser(userData._id)}>{userData.username}</button>
          </div>
          {
            isSearchingChats ? 
            (
              <SearchChats setIsSearchingChats = {setIsSearchingChats} />
            )
            :
            (
              <button className=' w-full rounded-lg  bg-white px-3 ' onClick={()=>setIsSearchingChats(true)}>
                <input
                type='text'
                placeholder='Search Users...'
                className="w-full px-4 py-2 border  rounded-lg focus:outline-none"
                />
              </button>
            )
          }
          {
            !isSearchingChats &&
          <div>
          <div className='w-full py-2 px-2'>
            <p>Messages..</p>
          </div>
          <div className='w-full px-2'>
            {
              // style={{fontWeight:isSearching ? 'bold' : 'normal'}}
              userChats.length > 0 ?
              (
                userChats.map((chat)=>(
                  <button key={chat._id} className="px-2 py-2 rounded  w-full space-x-10 hover:bg-gray-200 active:font-bold transition-colors duration-200"
                  onClick={()=>setSelectedChat(chat)}
                  >
                    <div className="flex items-center w-full mb-2 space-x-5">
                      {/* overflow-hidden */}
                      <div className="relative w-[60px] h-[60px] rounded-full  flex-shrink-0 ">
                        <img src={chat.members[0].profilePicture} className="w-full h-full object-cover block rounded-full"></img>
                        {
                          onlineUser.includes(chat.members[0]._id) &&
                          <div className="absolute top-0 right-0 flex items-center justify-center rounded-full w-[15px] h-[15px] bg-blue-600 border-white border z-50"/>
                        }
                      </div>
                      <div className='flex flex-col w-3/4 items-start'>
                        <div className='flex w-full items-center space-x-6 '>
                          <p className="font-bold ">{chat.members[0].username}</p>
                          {
                            chat.unreadMessagesCount[userData._id] > 0 &&
                            <div className='w-[10px] h-[10px] bg-red-600 rounded-full'></div>
                          }
                        </div>
                        <p className="text-sm text-gray-600 ">{chat.lastMessage.length > 30 ? chat.lastMessage.slice(0,30) + "..." : chat.lastMessage} - {getCustomTimeAgo(chat.lastMessageAt)}</p>
                      </div>
                    </div>
                  </button>
                ))
              )
              :
              (
                <div className='w-full'>
                  <p>No Messages Found</p>
                </div>
              )
            }
          </div>
          </div>
          }

        </div>
        <div className='h-full w-2/3'>
            {
              selectedChat ? 
              (
                <ChatWithUser />
              )
              :
              (
                <div className='w-full h-full flex items-center justify-center'>
                  <p>Select the chat</p>
                </div>
              )
            }
        </div>
    </div>
  )
}

export default Chat