import React, { useEffect, useRef, useState } from 'react'
import { useDataStore } from '../Store/getData'
import { useUserDataStore } from '../Store/userData';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';


const SearchBar = ({setIsSearching}) => {
    const {searchUsers,searchResults,searchLoading,setSearchLoading,clearSearch,setOtherUserId} = useDataStore();
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
                searchUsers(input);
            }
            else {
                clearSearch();
            }
        },300);

        return ()=>{
            clearTimeout(timer.current);
        }
    },[input])

    const handleUser = (otherUserID) => {
        if(otherUserID === userData._id){
            navigate('/Profile')
            return;
        }
        setOtherUserId(otherUserID);
        // navigate('/OtherUserProfile/:otherUserid'); --> This is needed when you want to search the user
        navigate('/OtherUserProfile');
        setIsSearching(false);
    }
  return (
    <div className='fixed top-0 left-64 h-screen  z-50'>
        <div className="relative min-w-[400px] rounded-lg  bg-white h-full px-5 pt-16" style={{ boxShadow: '10px 0 10px -2px rgba(0, 0, 0, 0.2)' }}>
            <button className='text-gray-700 absolute top-2 right-4' onClick={()=>setIsSearching(false)}>
                <X className="w-8 h-8"/>
            </button>
            <div className='mb-8'>
                <p className='text-5xl text-gray-400'>Search</p>
            </div>
            <input
            type='text'
            placeholder='Search Users...'
            className="w-full px-4 py-2 border  rounded-lg focus:outline-none"
            name='searchInput'
            id='searchInput'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            />

            {
                input === '' 
                && searchResults.length === 0 &&
                <p className='absolute top-1/2 left-1/3 text-gray-400'>Search the User</p>
            }

            {
                input !== '' 
                && searchResults.length === 0 && !searchLoading &&
                <p className='absolute top-1/2 left-1/3 text-gray-400'>No User Found</p>
            }

            {searchLoading ? 
            <p className=" mt-4 p text-sm text-gray-500">Searching...</p>
            :
                searchResults.length > 0 && 
                <ul>
                    {searchResults.map((user) => (
                        <li
                        key={user._id}
                        onClick={()=>handleUser(user._id)}
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
    </div>
  )
}

export default SearchBar