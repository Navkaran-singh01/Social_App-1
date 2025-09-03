import "./App.css";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import CreatePost from "./Pages/CreatePost";
import { useEffect, useState } from "react";
import { useAuthStore } from "./Store/auth";
import Loading from "./Components/Loading";
import Dashboard from "./Pages/Dashboard";
import { Routes, Route, useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import Profile from "./Pages/Profile";
import OtherUserProfile from "./Pages/OtherUserProfile";
import Followers from "./Pages/Followers";
import Followings from "./Pages/Followings";
import EditProfile from "./Pages/EditProfile";
import { GoHomeFill } from "react-icons/go";
import { MdOutlineAddBox } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { RiLogoutBoxLine } from "react-icons/ri";
import { Bold, Search, Send } from "lucide-react";
import React from "react";
import SearchBar from "./Components/SearchBar";
import CreateStory from "./Pages/CreateStory";
import Archieve from "./Pages/Archieve";
import Chat from "./Pages/Chat";
import { useUserDataStore } from "./Store/userData";
import IncomingCalls from "./Components/IncomingCall";



function App() {


  const { checkAuth , loading ,isAuthenticated , logout} = useAuthStore();
  const {messageNotification,IncomingCall} = useUserDataStore();
  const navigate = useNavigate();
  const [isSearching,setIsSearching] = useState(false);
  const [isIncomingCall,setIsIncomingCall] = useState(false);

  useEffect(()=>{
    if(IncomingCall){
      setIsIncomingCall(true);
    }
  },[IncomingCall])

  // Check authentication status on app load
  useEffect(() => {
    checkAuth();

  }, [checkAuth]);


  //Function to handle

  // Logout handler
  const logoutHandler = async () => {
    await logout();
    console.log("User logged out");
    navigate("/login");
  };


  // If loading, show a loading spinner
  if(loading) {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center px-4">
      {/* Background SVG */}
      {/* <img
        src="./assets/dashboard_background.svg"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover -z-10"
      /> */}
        <Loading />
      </div>
    );
  }


  return (
    // flex items-center justify-between w-screen h-screen 
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background SVG */}
      {/* <img
        src="./assets/dashboard_background.svg"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover -z-10"
      /> */}
    {
      isAuthenticated ? (
      <div className="flex justify-center w-[250px] h-screen fixed top-0 left-0 border-r-2">
        {/* This is the Navbar */}
        <div className="flex flex-col items-center mt-24 mx-4 space-y-4 w-full">
          <h1 className="text-[40px] mb-16" style={{ fontFamily: 'Billabong, sans-serif' }}>
            SocialApp
          </h1>
            <NavLink to="/dashboard" className={({ isActive }) => `px-2 py-2 rounded flex items-center justify-center w-full space-x-10 hover:bg-gray-200 transition-colors duration-200 ${isActive ? "font-bold" : ""}`}>
            <GoHomeFill fontSize={"1.8rem"}/>
            <p className="text-lg">Home</p>
            </NavLink>
            <button onClick={()=>setIsSearching(!isSearching)}  style={{fontWeight:isSearching ? 'bold' : 'normal'}} className="px-2 py-2 rounded flex items-center justify-center w-full space-x-10 hover:bg-gray-200 active:font-bold transition-colors duration-200">
            <Search className="w-7 h-7 "/>
            <p className="text-lg">Search</p>
            </button>
            <NavLink to="/Chat" className={({ isActive }) => `px-2 py-2 rounded flex items-center justify-center w-full space-x-10 hover:bg-gray-200 transition-colors duration-200 ${isActive ? "font-bold" : ""}`}>
            <div className="relative">
            <Send  className="w-7 h-7"/>
            {
                messageNotification > 0 &&
                <div className="absolute -top-2 -right-2 flex items-center justify-center rounded-full w-[20px] h-[20px] bg-red-600 border-white border">
                  {console.log(messageNotification)}
                  <p className="text-white text-xs">{messageNotification}</p>
                </div>
            }
            </div>
            <p className="text-lg pr-3 pl-2">Chat</p>
            </NavLink>
            <NavLink to="/CreatePost" className={({ isActive }) => `px-2 py-2 rounded flex items-center justify-center w-full space-x-10 hover:bg-gray-200 transition-colors duration-200 ${isActive ? "font-bold" : ""}`}>
            <MdOutlineAddBox  fontSize={"1.8rem"}/>
            <p className="text-lg">Create</p>
            </NavLink>
            <NavLink to="/Profile" className={({ isActive }) => `px-2 py-2 rounded flex items-center justify-center w-full space-x-10 hover:bg-gray-200 transition-colors duration-200 ${isActive ? "font-bold" : ""}`}>
            <CgProfile  fontSize={"1.8rem"}/>
            <p className="text-lg">Profile</p>
            </NavLink>
            <button onClick={logoutHandler} className="px-2 py-2 rounded flex items-center justify-center w-full space-x-10 hover:bg-gray-200 active:font-bold transition-colors duration-200">
            <RiLogoutBoxLine   fontSize={"1.8rem"}/>
            <p className="text-lg">Logout</p>
            </button>
        </div>
    </div>
      ):
      (<div>
      </div>)
    }
    {
      isSearching && 
      <SearchBar setIsSearching = {setIsSearching}/>
    }
    {
      isIncomingCall && 
      <IncomingCalls setIsIncomingCall = {setIsIncomingCall} IncomingCall={IncomingCall}/>
    }
      <Routes>
        <Route path="/" element={isAuthenticated ? (<Dashboard/>) : (<Login />)} />
        <Route path="/signup" element={isAuthenticated ? (<Dashboard/>) : (<Signup />)} />
        <Route path="/dashboard" element={isAuthenticated ? (<Dashboard/>) : (<Login />)} />
        <Route path="/login" element={isAuthenticated ? (<Dashboard/>) : (<Login />)} />
        <Route path="/profile" element={isAuthenticated ? (<Profile/>) : (<Login />)} />
        <Route path="/Chat" element={isAuthenticated ? (<Chat/>) : (<Login />)} />
        <Route path="/CreatePost" element={isAuthenticated ? (<CreatePost/>) : (<Login />)} />
        <Route path="/CreateStory" element={isAuthenticated ? (<CreateStory/>) : (<Login />)} />
        <Route path="/OtherUserProfile" element={isAuthenticated ? (<OtherUserProfile/>) : (<Login />)} />
        <Route path="/Followers" element={isAuthenticated ? (<Followers/>) : (<Login />)} />
        <Route path="/Followings" element={isAuthenticated ? (<Followings/>) : (<Login />)} />
        <Route path="/Archieve" element={isAuthenticated ? (<Archieve/>) : (<Login />)} />
        <Route path="/EditProfile" element={isAuthenticated ? (<EditProfile/>) : (<Login />)} />  
      </Routes>
    </div>
  );
}

export default App;
