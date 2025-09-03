import React, { useEffect, useState } from "react";
import { MdGridOn } from "react-icons/md";
import { MdSaveAlt } from "react-icons/md";
import PassivePost from "../Components/PassivePost";
import { useDataStore } from "../Store/getData";
import { useInteractionStore } from "../Store/interaction";
import OtherUserFollow from "../Components/OtherUserFollow";


const OtherUserProfile = () => {
    const {otherUserData,otherUserId,getOtherUserDetails} = useDataStore();
    const {requestToFollow} = useInteractionStore();
//   const {userData,getUserData} = useUserDataStore();

  // The logic of showData which is used for private account is pending
   const [showData,setShowData] = useState(true);
   const [isFollow,setIsFollow] = useState(false);
   const [isShowFollow,setIsShowFollow] = useState(false);
   const [Follow,setFollow] = useState([]);

//   const{userPosts,getUserPosts} = useUserDataStore();

//   useEffect(()=>{
//      getOtherUserDetails();
//     console.log("User Posts in the Profile component : ",otherUserData);
//   },[otherUserData,getOtherUserDetails]);


  useEffect(() => {
    console.log("challlpaaaaa")
    if (otherUserId) {
      setFollow([]);
      setIsShowFollow(false);
        console.log("Intehksdfjksadjf ::::: ",otherUserId)
        getOtherUserDetails();
    }
}, [otherUserId]);

useEffect(()=>{
    if(otherUserData) setIsFollow(otherUserData.isFollowing);
},[otherUserData])

useEffect(() => {
  console.log("OtherUserProfile rendered");
}, []);

   const followHandler = () => {
    setIsFollow(!isFollow);
    requestToFollow(otherUserId);
   }

   const handleShowFollow = (Followers) => {
    if(Followers){
      setFollow(otherUserData.otherUser.followers)
      setIsShowFollow(true)
    }
    else{
      setFollow(otherUserData.otherUser.following)
      setIsShowFollow(true);
    }
   }


  //UserData is still null 
  // useEffect(()=>{
  //   if(userData === null) getUserData();
  // },[userData,getUserData])
  console.log("Is Show Follow ",isShowFollow)
  console.log(otherUserData);
  console.log(otherUserId)
  return (
    <div className="flex justify-center w-[700px] min-h-screen bg-white rounded-lg shadow-lg">
        {
            otherUserData ? 
            (
      <div className="space-y-10">
        <div className="flex mt-10 space-x-10">
          {/* Div for Image  */}
          <div className="w-[150px] h-[150px] bg-slate-300 rounded-full">
            <img src={otherUserData.otherUser.profilePicture} className="w-full h-full object-cover rounded-full"></img>
          </div>
          {/* For the right section */}
          <div className="flex flex-col space-y-5">
            <div className="flex items-center space-x-10">
              <h2 className="text-2xl">{otherUserData.otherUser.username}</h2>
            </div>

            {/* User information */}
            <div className="flex items-center space-x-10">
              <p>{otherUserData.otherUser.posts.length} Posts</p>
              <button
              onClick={()=>handleShowFollow(true)}
              >
                {otherUserData.otherUser.followers.length} Followers
              </button>
              <button
              onClick={()=>handleShowFollow(false)}
              >
                {otherUserData.otherUser.following.length} Following
              </button>
            </div>


            <div>
              <p className="text-sm text-gray-400r">{otherUserData.otherUser.bio}</p>
            </div>
            <div>
                <button className="bg-green-400 text-white px-3 py-1 rounded" onClick={followHandler}>
                    {
                        isFollow ? "Unfollow" : "Follow"
                    }
                </button>
            </div>
          </div>
        </div>

        {/* This is to go posts or saved posts */}
        <div className="flex items-center">

          {/* This is for the posts */}
          <div className="flex items-center justify-center w-1/2">
            <button>
              <MdGridOn fontSize={"1.8rem"} />
            </button>
          </div>

          {/* This is for the saved posts */}
          <div className="flex items-center justify-center w-1/2 ">
            <button>
              <MdSaveAlt  fontSize={"1.8rem"}/>
            </button>
          </div>

        </div>

        {/* This is to show posts or saved posts */}

        <div className="grid grid-cols-2 gap-3 pb-10">
          {
            showData ? 
            (otherUserData.otherUserPosts.length > 0 && 
            (
              otherUserData.otherUserPosts.map((post) => {
                return (<PassivePost key={post._id} post = {post}/>)
              })
            )) 
             : 
            (
              otherUserData.savedPosts.map((postId ,index) => (
                <PassivePost key={index} postId = {postId}/>
              ))
            )
          }
        </div>


      </div>        
            )
            :
            (
                <div>
                    Loading......
                </div>
            )
        }
        {
          isShowFollow && 
          <OtherUserFollow setIsShowFollow = {setIsShowFollow} Follow={Follow}/>
        }
    </div>
  );
}

export default OtherUserProfile