import React, { useEffect, useState } from 'react'
import { useDataStore } from '../Store/getData'
import { useNavigate } from 'react-router-dom';
import { useInteractionStore } from '../Store/interaction';

const Followings = () => {
    const {following,getFollowing,setOtherUserId} = useDataStore();
    const {requestToFollow} = useInteractionStore();
    const [unfollowed,setUnfollowed] = useState([]);
    const navigate = useNavigate();
    useEffect(()=>{
        getFollowing();
    },[])

    const otherUserHandle = (otherUserID) => {
        setOtherUserId(otherUserID);
        // navigate('/OtherUserProfile/:otherUserid'); --> This is needed when you want to search the user
        navigate('/OtherUserProfile');
    }

    const removeHandler = (otherID) => {
        console.log("The id that i am about to pass",otherID);
        setUnfollowed((prev) => [...prev,otherID]);
        requestToFollow(otherID);
    }

    console.log("Followings are --> ",following);
  return (
    <div className="flex flex-col items-center w-[700px] min-h-screen bg-white rounded-lg shadow-lg ">
        <p className='pt-5 text-2xl text-gray-300 border-b-2'>Followings...</p>
        <div className='p-10 w-full'>
            {
                following.length > 0 &&
                following.map((followingUser) => (
                    !unfollowed.includes(followingUser._id) &&
                    <div key={followingUser._id} className='border-b-2 mt-2'>
                        <div className="flex items-center w-full  mb-2 space-x-2">
                            <div className="w-[100px] h-[100px] rounded-full ">
                                <img src={followingUser.profilePicture} className="w-full h-full object-cover rounded-full"></img>
                            </div>
                            <div className='flex w-4/6 pr-5 justify-between '>
                                <button className="font-bold text-2xl" onClick={()=>otherUserHandle(followingUser._id)}>
                                    {followingUser.username}
                                </button>
                                <button className="bg-green-400 text-white px-3 py-1 rounded" onClick={()=>removeHandler(followingUser._id)}>
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

export default Followings