import React, { useEffect, useState } from 'react'
import { useDataStore } from '../Store/getData';
import { useInteractionStore } from '../Store/interaction';
import { useNavigate } from 'react-router-dom';

const Followers = () => {
    const {followers,getFollowers,setOtherUserId} = useDataStore();
    const {removeFromFollowers} = useInteractionStore();
    const [removed,setRemoved] = useState([]);
    const navigate = useNavigate();
    useEffect(()=>{
        getFollowers();
    },[])

    const otherUserHandle = (otherUserID) => {
        setOtherUserId(otherUserID);
        // navigate('/OtherUserProfile/:otherUserid'); --> This is needed when you want to search the user
        navigate('/OtherUserProfile');
    }

    const removeHandler = (otherID) => {
        console.log("The id that i am about to pass",otherID);
        setRemoved((prev)=>[...prev,otherID]);
        removeFromFollowers(otherID);
    }

    console.log("Followings are --> ",followers);
  return (
    <div className="flex flex-col items-center w-[700px] min-h-screen bg-white rounded-lg shadow-lg ">
        <p className='pt-5 text-2xl text-gray-300 border-b-2'>Followers...</p>
        <div className='p-10 w-full'>
            {
                followers.length > 0 &&
                followers.map((followerUser) => (
                    !removed.includes(followerUser._id) &&
                    <div key={followerUser._id} className='border-b-2 mt-2'>
                        <div className="flex items-center w-full  mb-2 space-x-2">
                            <div className="w-[100px] h-[100px] rounded-full ">
                                <img src={followerUser.profilePicture} className="w-full h-full object-cover rounded-full"></img>
                            </div>
                            <div className='flex w-4/6 pr-5 justify-between '>
                                <button className="font-bold text-2xl" onClick={()=>otherUserHandle(followerUser._id)}>
                                    {followerUser.username}
                                </button>
                                <button className="bg-green-400 text-white px-3 py-1 rounded" onClick={()=>removeHandler(followerUser._id)}>
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
    </div>
  )
}

export default Followers