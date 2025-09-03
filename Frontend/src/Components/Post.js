import React ,{ useCallback, useEffect, useState}from "react";
import { FcLike } from "react-icons/fc";
import { FcLikePlaceholder } from "react-icons/fc";
import { FaBookmark } from "react-icons/fa6";
import { FaRegBookmark } from "react-icons/fa6";
import { useInteractionStore } from "../Store/interaction";
import { useUserDataStore } from "../Store/userData";
import { FaComment } from "react-icons/fa";
import { useDataStore } from "../Store/getData";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from '../lib/axios';
import { formatDistanceToNowStrict } from 'date-fns';
import { GoComment } from "react-icons/go";
import { FaRegComment } from "react-icons/fa";
import { Heart ,MessageCircle ,Bookmark} from "lucide-react";

const Post = ({post}) => {

    const {likePost,commentPost,savePost} = useInteractionStore();
    const {userData} = useUserDataStore();
    const {setOtherUserId} = useDataStore();
    // const getCommentsOnPost = useDataStore((state) => state.getCommentsOnPost);
    // const commentsOnPost = useDataStore((state) => state.CommentsOnPost[post._id]);
    const [commentsOnPost,setCommentsOnPost] = useState();


    const [fullCaption, setFullCaption] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved,setIsSaved] = useState(false);
    const [comments, setComments] = useState(false);
    const navigate = useNavigate();

    const [mycomment,setMyComment] = useState([]);
    const [commentToSend,setCommentToSend] = useState();

    useEffect(() => {
        // Check if the post is liked by the user
        console.log("Hun chalea ehe ")
        if (userData && userData.likes) {
            setIsLiked(userData.likes.includes(post._id));
            setIsSaved(userData.savedPosts.includes(post._id));
        }
        
    }, [userData, post._id]);

    //WE have to find out why it is not working with zustand
    const getCommentsOnPost = async (postId) => {
            try {
                const response = await axiosInstance.get(`/getData/getCommentsOnPost/${postId}`);
                console.log("Comments fetched successfully:", response);
                // set((state)=>({ CommentsOnPost : {
                //     ...state.CommentsOnPost,
                //     [postId] : response.data.comments
                // } }));
                // console.log("Comments for post:", postId, "are:", get().CommentsOnPost[postId]);
                setCommentsOnPost(response.data.comments);
            } catch (error) {
                console.error("Get Comments Error:", error);
            }
    }

    useEffect(()=>{
        if(comments && !commentsOnPost){
            getCommentsOnPost(post._id);
        }
    },[comments])

    // Function to handle like action
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

    // Function to handle comment action
    //The functions donot work together because when you call the setcomments 
    //it works internally and it doesnot update it renders but before that the 
    //getCommentsonPost is called which interrupts it
    const commentHandler =  () => {
        setComments(!comments);
    }

    function isImage(url) {
         return /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(url);
    }


    const sendCommentHandler = async() => {
        setMyComment((prev) => [...prev,commentToSend]);
        await commentPost(post._id,commentToSend);
        setCommentToSend("");
    }

    const otherUserHandleFromPost = () => {
        if(post.userid._id === userData._id){
            navigate('/Profile')
            return;
        }
        setOtherUserId(post.userid._id);
        // navigate('/OtherUserProfile/:otherUserid'); --> This is needed when you want to search the user
        // The above will help to remount the OtherUSerProfile because the url is changed 
        // if we use the same then it not remount it just like there already so the local state donot change
        navigate('/OtherUserProfile');
    }

    const otherUserHandleFromComment = (otherUserID) => {
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
//mb-4
  
  return (
    <div className="flex flex-col items-center justify-center w-full   p-4 border-b-2">

        {/* This is for Posted By */}
        <div className="flex items-center w-full mb-2 space-x-2">
            <div className="w-[50px] h-[50px] rounded-full overflow-hidden flex-shrink-0 ">
                <img src={post.userid.profilePicture} className="w-full h-full object-cover block rounded-full"></img>
            </div>
            <button className="font-bold text-sm" onClick={otherUserHandleFromPost}>{post.userid.username}</button>
        </div>

        {console.log("Rendering Post:", post)}
        <div className= "w-full h-[600px] overflow-hidden flex-shrink-0">
            {
                    isImage(post.content) ? 

                    //This is for the image Post
                    (
                        <img src={post.content} className="w-full h-full object-cover rounded-lg"></img>
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
                    )
            }
            </div>

            

            {/* These are the icons */}
            <div className="flex items-center justify-between space-x-4 w-full mt-2 pr-2">
                <div className="flex items-center space-x-4 ">
                <button onClick={likeHandler}>
                    <Heart className={`w-7 h-7 transition-all duration-200 ${isLiked ? 'text-red-500 scale-110' : 'text-black scale-100'}`} fill={isLiked ? 'red' : 'none'} color={isLiked ? 'red' : 'black'} />
                </button>

                <button type="button" onClick={commentHandler}>
                    <MessageCircle className={`w-7 h-7 transition-all duration-200 ${comments ? 'text-green-600 scale-110' : 'text-black scale-100'}`} fill={comments ? 'blue' : 'none'} color={comments ? 'blue' : 'black'} />
                </button>
                </div>

                <button onClick={savedHanler}>
                    <Bookmark className={`w-7 h-7 transition-all duration-200 ${isSaved ? 'text-blue-600 scale-110' : 'text-black scale-100'}`} fill={isSaved ? 'blue' : 'none'} color={isSaved ? 'blue' : 'black'} />
                </button>
            </div>

            {/* This is for the Caption */}
            <p className="text-sm mt-4 w-full">
                {
                    fullCaption ? post.caption : post.caption.length > 100 ? post.caption.slice(0, 100) + "..." : post.caption
                }
                <button 
                    className="text-blue-500 ml-2"
                    onClick={() => setFullCaption(!fullCaption)}
                    >
                    {fullCaption ? "Show Less" : "Show More"}
                </button>
            </p>

            {/* This is for the comments */}
            <div className="w-full flex flex-col">
                { comments &&
                (
                    <div className="mt-4">
                        {commentsOnPost || mycomment.length > 0 ? (
                            <div>
                                <p>Comments...</p>
                                <div className="max-h-[300px] overflow-y-auto">
                                {
                                    mycomment.length > 0 &&
                                    mycomment.map((comment) => (
                                        //This is for the comments send
                                        <div className="p-2 flex items-start min-h-[60px] mb-2">
                                            <div className="w-[50px] h-[50px] rounded-full overflow-hidden flex-shrink-0  ">
                                                <img src={userData.profilePicture} className="w-full h-full object-cover rounded-full"></img>
                                            </div>
                                            <div className="ml-2 space-y-1">
                                                <p className="font-bold text-sm">{userData.username}</p>
                                                <p className="text-sm leading-5">{comment}</p>
                                                <p className="text-xs text-gray-500">now</p>
                                            </div>
                                        </div>
                                ))
    
                                }
                                {
                                commentsOnPost.map((comment) => (
                                    <div key={comment._id} className="p-2 flex items-start min-h-[60px] mb-2">
                                        <div className="w-[50px] h-[50px] rounded-full overflow-hidden flex-shrink-0 ">
                                            <img src={comment.commentBy.profilePicture} className="w-full h-full object-cover rounded-full"></img>
                                        </div>
                                        <div className="ml-2 space-y-1">
                                            <button className="font-bold text-sm" onClick={()=>otherUserHandleFromComment(comment.commentBy._id)}>{comment.commentBy.username}</button>
                                            <p className="text-sm leading-5">{comment.content}</p>
                                            <p className="text-xs text-gray-500">{getCustomTimeAgo(comment.createdAt)}</p>
                                        </div>
                                    </div>
                                ))
                                }
                                </div>

                                
                            </div>
                        ) : (
                            <p className="text-gray-500">No comments yet.</p>
                        )}
                        {/* This is to send the the comment  */}
                                <div>
                                    <div className="flex items-center mb-2 space-x-2 pt-2 border-t-2">
                                        <div className="w-[40px] h-[40px] rounded-full ">
                                            <img src={userData.profilePicture} className="w-full h-full object-cover rounded-full"></img>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm text-gray-600">{userData.username}</p>
                                        </div>
                                    </div>
                                    <textarea placeholder="Add a comment..." value={commentToSend} onChange={(e)=>{setCommentToSend(e.target.value)}}
                                        className="w-full min-h-[32px] resize-none overflow-hidden bg-gray-50 text-sm text-gray-800 
                                                 placeholder-gray-400 px-3 py-2 rounded-md border border-transparent 
                                                   focus:outline-none focus:border-gray-300 transition-colors"
                                    ></textarea>
                                    <div className="w-full flex items-center justify-end">
                                        <button className="text-blue-600 font-bold" onClick={sendCommentHandler}>send</button>
                                    </div>
                                </div>
                    </div>
                )
                }
            </div>
    </div>
  );
}   

export default Post;