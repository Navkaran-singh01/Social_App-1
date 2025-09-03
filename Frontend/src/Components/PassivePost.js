
import React, { useEffect, useState } from "react";
import { FaComment } from "react-icons/fa";
import { AiFillLike } from "react-icons/ai";
import { X } from "lucide-react";
import { useUserDataStore } from "../Store/userData";
import { axiosInstance } from "../lib/axios";
import { formatDistanceToNowStrict } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useDataStore } from "../Store/getData";
import { Heart ,MessageCircle,Bookmark} from "lucide-react";
import { useInteractionStore } from "../Store/interaction";
import { Smile } from 'lucide-react';
import { useDeleteStore } from "../Store/delete";


const PassivePost = ({post}) =>{
    console.log("In the passive post : ",post)

    const {setOtherUserId} = useDataStore();
    const {likePost,commentPost,savePost} = useInteractionStore();
    const {deletePost} = useDeleteStore();

    const [showPost,setShowPost] = useState(false);
    const {userData} = useUserDataStore();
    const [comments,setComments] = useState([]);
    const [isLiked,setIsLiked] = useState(false);
    const [isSaved,setIsSaved] = useState(false);

    const [mycomment,setMyComment] = useState([]);
    const [commentToSend,setCommentToSend] = useState();

    const navigate = useNavigate();

    function isImage(url) {
         return /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(url);
    }

    const getCommentsOnPost = async (postId) => {
                try {
                    const response = await axiosInstance.get(`/getData/getCommentsOnPost/${postId}`);
                    console.log("Comments fetched successfully:", response);
                    // set((state)=>({ CommentsOnPost : {
                    //     ...state.CommentsOnPost,
                    //     [postId] : response.data.comments
                    // } }));
                    // console.log("Comments for post:", postId, "are:", get().CommentsOnPost[postId]);
                    setComments(response.data.comments);
                } catch (error) {
                    console.error("Get Comments Error:", error);
                }
    }

    const showMePost = () => {
        setShowPost(!showPost);
        if(comments.length < 1){
            getCommentsOnPost(post._id);
            setMyComment([]);
        }
        if(post.likes.includes(userData._id)) setIsLiked(true);
        if(userData.savedPosts.includes(post._id)) setIsSaved(true);
    }

    const sendCommentHandler = async() => {
        setMyComment((prev) => [...prev,commentToSend]);
        await commentPost(post._id,commentToSend);
        setCommentToSend("");
    }

    const otherUserHandleFromComment = (otherUserID) => {
        if(otherUserID === userData._id){
            setShowPost(!showPost);
            return;
        }
        setOtherUserId(otherUserID);
        // navigate('/OtherUserProfile/:otherUserid'); --> This is needed when you want to search the user
        navigate('/OtherUserProfile');
    }

    const likeHandler = async() => {
        setIsLiked(!isLiked);
        // Here you would typically also send a request to the server to update the like status
        likePost(post._id);
        console.log("Post liked:", post._id, "Status:", !isLiked);
    };

    const savedHanler = async() => {
        setIsSaved(!isSaved);
        savePost(post._id);
        console.log("Post Saved: ", post._id ,"Status",!isSaved);
    }

    const handleDeletePost = async () => {
        const res = await deletePost(post._id);
        if(res){
            setShowPost(!showPost);
            navigate("/Profile");
        }
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
    
    return(
        <div>
            <button onClick={showMePost} className="relative h-[300px] w-[250px] group">
                {
                    isImage(post.content) ? 
                    (
                        <img src={post.content} className="w-full h-full"></img>
                    ) : 
                    (
                        <div className="w-[250px] h-[300px]">
                        <video
                            controls
                            autoPlay
                            muted
                            className="w-full h-full object-cover"
                        >
                            <source src={post.content} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                        </div>
                    )
                }

                <div className="absolute inset-0 bg-black bg-opacity-80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto flex items-center justify-center text-white text-lg font-semibold">
                    <div className="flex items-center space-x-10">
                        {
                            post.likes.length > 0 &&
                        <div className="flex space-x-1">
                            <AiFillLike  fontSize={"1.5rem"} color="white"/>
                            <p>
                                {post.likes.length}
                            </p>
                        </div>
                        }
                        {
                            post.comments.length > 0 && 
                        <div className="flex space-x-1">
                            <FaComment fontSize={"1.3rem"} color="white"/>
                            <p className="pl-1">
                                {post.comments.length + mycomment.length}
                            </p>
                        </div>
                        }
                    </div>
                </div>
            </button>

            {/* This is to show the full post */}
            {
                showPost && 
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50  z-50 flex items-center justify-center" >


                    <button className="text-white fixed top-2 right-7" onClick={showMePost}>
                        <X className="w-8 h-8"/>
                    </button>

                    <div className=" bg-white w-9/12 h-5/6 flex">

                        {/* Post image */}
                        <div className="h-full w-3/5">
                            {isImage(post.content) ? 

                    //This is for the image Post
                    (
                        <img src={post.content} className="w-full h-full"></img>
                    ) : 

                    //This for the video Post
                    (
                        <div className="w-full h-full">
                        <video
                            controls
                            autoPlay
                            muted
                            className="w-full h-full object-cover"
                        >
                            <source src={post.content} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                        </div>
                    )}
                        </div>

                        <div className="w-2/5 h-full p-2 pt-4 flex flex-col justify-between border-l-2">
                            <div>
                            
                            {/* Posted by */}
                            <div className="flex items-center w-full mb-2 space-x-5 border-b-2 pb-3 pl-5">
                                {/* from this we can identity if this is user post or saved post  */}
                                {console.log("The passive Post is : ",post.userid._id)}
                                <div className="w-[40px] h-[40px] rounded-full ">
                                    <img src={post.userid._id ? post.userid.profilePicture : userData.profilePicture} className="w-full h-full object-cover rounded-full"></img>
                                </div>
                                <button className="font-bold text-sm" onClick={()=>post.userid._id ? otherUserHandleFromComment(post.userid._id) : otherUserHandleFromComment(userData._id)}>{post.userid._id ? post.userid.username : userData.username}</button>
                                {
                                    post.userid === userData._id && 
                                    <button onClick={handleDeletePost}>delete</button>
                                }
                            </div>

                            {/* To Show the comments on the Post */}
                            <div className=" h-[380px] overflow-y-auto will-change-transform">
                                {
                                    mycomment.length > 0 &&
                                    (
                                        mycomment.map((comment) => (
                                            <div key={comment._id} className="flex items-center w-full mb-2 space-x-2  pb-2 pl-3">
                                                <div className="w-[40px] h-[40px] rounded-full overflow-hidden flex-shrink-0 ">
                                                    <img src={userData.profilePicture} className="w-full h-full object-cover block rounded-full"></img>
                                                </div>
                                                <div>
                                                    <div className="ml-2 space-y-1">
                                                        <button className="font-bold text-sm" onClick={()=>otherUserHandleFromComment(userData._id)}>{userData.username}</button>
                                                        <p className="text-sm leading-5">{comment}</p>
                                                        <p className="text-xs text-gray-500">now</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )
                                }
                                {
                                    comments.length > 0 &&
                                    (
                                        comments.map((comment) => (
                                            <div key={comment._id} className="flex items-center w-full mb-2 space-x-2  pb-2 pl-3">
                                                <div className="w-[40px] h-[40px] rounded-full overflow-hidden flex-shrink-0">
                                                    <img src={comment.commentBy.profilePicture} className="w-full h-full object-cover block rounded-full"></img>
                                                </div>
                                                <div>
                                                    <div className="ml-2 space-y-1">
                                                        <button className="font-bold text-sm" onClick={()=>otherUserHandleFromComment(comment.commentBy._id)}>{comment.commentBy.username}</button>
                                                        <p className="text-sm leading-5">{comment.content}</p>
                                                        <p className="text-xs text-gray-500">{getCustomTimeAgo(comment.createdAt)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )
                                }
                                {
                                    comments.length === 0 && mycomment.length === 0 &&
                                        <div>
                                            <p className="text-sm text-gray-400">No Comments yet</p>
                                        </div>
                                }
                            </div>
                            </div>

                            {/* To Show icons and to send comment */}
                            <div className="space-y-2 flex flex-col w-full  border-t-2  px-3">

                                {/* To show the icons and all */}
                                <div className="flex items-center justify-between space-x-4 w-full mt-2 pr-2">
                                    <div className="flex items-center space-x-4 ">
                                        <button onClick={likeHandler}>
                                            <Heart className={`w-7 h-7 transition-all duration-200 ${isLiked ? 'text-red-500 scale-110' : 'text-black scale-100'}`} fill={isLiked ? 'red' : 'none'} color={isLiked ? 'red' : 'black'} />
                                        </button>

                                        <button type="button" onClick={()=>setComments(!comments)}>
                                            <MessageCircle className={`w-7 h-7 transition-all duration-200 ${comments ? 'text-green-600 scale-110' : 'text-black scale-100'}`} fill={comments ? 'blue' : 'none'} color={comments ? 'blue' : 'black'} />
                                        </button>
                                    </div>

                                    <button onClick={savedHanler}>
                                        <Bookmark className={`w-7 h-7 transition-all duration-200 ${isSaved ? 'text-blue-600 scale-110' : 'text-black scale-100'}`} fill={isSaved ? 'blue' : 'none'} color={isSaved ? 'blue' : 'black'} />
                                    </button>
                                </div>
                                <div>
                                    <p>{post.likes.length} Likes</p>
                                    <p className="text-xs text-gray-500">{getCustomTimeAgo(post.createdAt)} ago</p>
                                </div>

                                {/* To add the comment to Post */}
                                <div className="flex items-center  py-2 border-t bg-white">
                                    {/* Emoji Icon */}
                                    <Smile className="w-6 h-6 text-black" />

                                    {/* Input Field */}
                                    <input
                                    type="text"
                                    placeholder="Add a comment..."
                                    className="flex-1 mx-4 border-none outline-none text-sm placeholder-gray-500 bg-transparent"
                                    value={commentToSend} onChange={(e)=>{setCommentToSend(e.target.value)}}
                                    />

                                    {/* Post Button */}
                                    <button className="text-sm font-semibold text-blue-400 hover:text-blue-500 transition" onClick={sendCommentHandler}>
                                        Post
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}
export default PassivePost;