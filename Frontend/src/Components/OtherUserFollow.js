import React from 'react'
import { X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useDataStore } from '../Store/getData'
import { useUserDataStore } from '../Store/userData'

const OtherUserFollow = ({setIsShowFollow,Follow}) => {
  const {setOtherUserId} = useDataStore();
  const {userData} = useUserDataStore();
  const navigate = useNavigate();

    const otherUserHandle = (otherUserID) => {
      if(otherUserID === userData._id){
        navigate('/Profile')
        return;
      }
      setOtherUserId(otherUserID);
      // navigate('/OtherUserProfile/:otherUserid'); --> This is needed when you want to search the user
      navigate('/OtherUserProfile');
    }
  console.log("The information for the follow ",Follow)
  return (
    <div>
        <div className="fixed top-5 right-10 shadow-2xl rounded-lg flex justify-center w-[250px] h-[500px] pt-14 border space-y-2">
          <div className="w-[200px]">
            {
              Follow.length > 0 ?
              (
                Follow.map((user)=>(
                  <div key={user._id} className="flex items-center w-full mb-2 space-x-2">
                    <div className="w-[50px] h-[50px] rounded-full overflow-hidden flex-shrink-0 ">
                      <img src={user.profilePicture} className="w-full h-full object-cover block rounded-full"></img>
                    </div>
                    <button className="font-bold text-sm" onClick={()=>otherUserHandle(user._id)}>{user.username}</button>
                  </div>
                ))
              )
              :
              (
                <p>No User Interaction</p>
              )
              
            }
          </div>
          <button className="absolute top-1 right-3" onClick={()=>setIsShowFollow(false)}>
            <X className="w-8 h-8 text-gray-700"/>
          </button>
        </div>
    </div>
  )
}

export default OtherUserFollow