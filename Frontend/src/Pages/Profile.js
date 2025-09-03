import React, { useEffect, useState } from "react";
import { useUserDataStore } from "../Store/userData";
import { MdGridOn } from "react-icons/md";
import { MdSaveAlt } from "react-icons/md";
import PassivePost from "../Components/PassivePost";
import { useNavigate } from "react-router-dom";
import { Settings, X } from "lucide-react";

const Profile = () => {
  const {userData,getUserData} = useUserDataStore();
  const [settings,setSettings] = useState(false);
  const [postsSelected,setPostSelected] = useState(true);
  const navigate = useNavigate();

  const{userPosts,getUserPosts,userSavedPosts,getUserSavedPosts} = useUserDataStore();

  useEffect(()=>{
    getUserData();
     getUserPosts();
     getUserSavedPosts();
    console.log("User Posts in the Profile component : ",userPosts);
    console.log("User Saved Posts in the Profile component : ",userSavedPosts);
  },[])

  const goToFollowers = () => {
    navigate('/Followers');
  }

  const goToFollowings = () => {
    navigate('/Followings');
  }

  const goToEditProfile = () => {
    navigate('/EditProfile');
  }


  //UserData is still null 
  // useEffect(()=>{
  //   if(userData === null) getUserData();
  // },[userData,getUserData])

  console.log(userData);
  if(!userData){
    return(
      <div className="flex justify-center w-[700px] min-h-screen bg-white rounded-lg shadow-lg">
        Loading...
      </div>
    )
  }
  return (
    <div className="flex justify-center w-[700px] min-h-screen bg-white rounded-lg shadow-lg ">
      <div className="space-y-5">

        {/* This is for the Personal data */}
        <div className="flex mt-10 pb-4 space-x-10">

          {/* Div for Image  */}
          <div className="w-[150px] h-[150px] rounded-full">
            <img src={userData.profilePicture} className="w-full h-full object-cover rounded-full"></img>
          </div>


          {/* For the right section */}
          <div className="flex flex-col space-y-5">

            {/* This is for Username and to edit profile */}
            <div className="flex items-center space-x-10">
              <h2 className="text-2xl">{userData.username}</h2>
              <button 
              onClick={goToEditProfile}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition">
                <p>Edit Profile</p>
              </button>
              <button onClick={()=>setSettings(!settings)}>
                <Settings className="h-8 w-8"/>
              </button>
            </div>


            {/* This is for no of Posts,Followings,Followers */}
            <div className="flex items-center space-x-10">
              <p>{userData.posts.length} Posts</p>
              <button onClick={goToFollowers}>
                {userData.followers.length} Followers
              </button>
              <button onClick={goToFollowings}>
                {userData.following.length} Following
              </button>
            </div>


            {/* This div is for bio */}
            <div>
              <p className="text-sm text-gray-400r">{userData.bio}</p>
            </div>
          </div>
        </div>

        {/* This is for the Highlights */}

        {/* This is to navigate to posts or saved posts */}
        <div className="flex items-center ">

          {/* This is for the posts */}
          <div className="flex items-center justify-center w-1/2">
            <button onClick={()=>setPostSelected(true)}>
              <MdGridOn fontSize={"1.8rem"}/>
            </button>
          </div>

          {/* This is for the saved posts */}
          <div className="flex items-center justify-center w-1/2 ">
            <button onClick={()=>setPostSelected(false)}>
              <MdSaveAlt  fontSize={"1.8rem"}/>
            </button>
          </div>

        </div>

        {/* This is to show posts or saved posts */}

        <div className="grid grid-cols-2 gap-3 pb-10">
          {
            postsSelected ? 
            (userPosts.length > 0 && 
            (
              userPosts.map((post) => {
                return (<PassivePost key={post._id} post = {post}/>)
              })
            )) 
             : 
            (userSavedPosts.length > 0 && 
            (
              userSavedPosts.map((post) => {
                return (<PassivePost key={post._id} post = {post}/>)
              })
            ))
          }
        </div>


      </div>

      {
        settings &&
        <div className="fixed top-5 right-10 shadow-2xl rounded-lg flex justify-center w-[250px] h-[500px] pt-14 border space-y-2">
          <div className="w-[200px]">
            <button 
            onClick={()=>navigate('/Archieve')}
            className="w-full p-2 hover:bg-gray-200 transition-colors duration-200 rounded-lg">
              Archieve
            </button>
          </div>
          <button className="absolute top-1 right-3" onClick={()=>setSettings(false)}>
            <X className="w-8 h-8 text-gray-700"/>
          </button>
        </div>
      }
    </div>
  );
}   

export default Profile;


// Console.log(...) returns the undefined