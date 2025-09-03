import React, { memo, useCallback, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useDataStore } from "../Store/getData";
import Post from "../Components/Post";
import { useUserDataStore } from "../Store/userData";
import Loading from "../Components/Loading";
import Stories from "../Components/Stories";

const Dashboard = () => {

  const {posts,stories,getPosts,getStories} = useDataStore();
  const { getUserData } = useUserDataStore();
  const [fetched,setFetched] = useState(false);
  const [skip,setSkip] = useState(0);
  const [fetchedMore,setFetchedMore] = useState(false);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  //This is used when you have large list of data and if something is changed for one element
  //of list then all the elements will be re-render , so to prevent this we use the memo
  const MemoizedPost = memo(Post);

  const initialFetchPosts = useCallback(async() => {
    await getUserData();
    await getPosts(false,0);
    await getStories();
    setFetched(true);
  },[getUserData,getPosts,getStories])


  // This effect can be used to fetch data or perform side effects
  useEffect(() => {
    console.log("Dashboard ala chalea")
    if(!fetched) initialFetchPosts();
  }, [initialFetchPosts]);

  //This is for the more posts to be fetched

  const fetchMorePosts = useCallback(async() => {
    if(fetchedMore || !hasMorePosts) return;
    setFetchedMore(true);
    const uniquePosts = await getPosts(true,skip+5);
    if(uniquePosts.length === 0)setHasMorePosts(false);
    setSkip(prev => prev + 5);
    setFetchedMore(false)
  },[skip,getPosts,fetchedMore])

  useEffect(()=>{
    if(!hasMorePosts) return
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = window.innerHeight;

      if(clientHeight + scrollTop >= scrollHeight-100 && !fetchedMore){
        fetchMorePosts();
      }
    }
    window.addEventListener('scroll',handleScroll)
    return () => window.removeEventListener('scroll',handleScroll);

  },[fetchMorePosts,fetchedMore,hasMorePosts])

  

//   useEffect(() => {
//   const handleScroll = () => {
//     if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
//       fetchPosts();
//     }
//   };

//   window.addEventListener('scroll', handleScroll);
//   return () => window.removeEventListener('scroll', handleScroll);
// }, []);

  if ( !fetched) {
    return (
      <div  className="relative min-h-screen flex flex-col items-center justify-center px-4">
      {/* Background SVG */}
      {/* <img
        src="./assets/dashboard_background.svg"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover -z-10"
      /> */}
        <Loading />
      </div>
    )
  }

  //rounded-lg shadow-lg
  
  return ( 
    <div className=" relative flex flex-col items-center justify-center w-[550px] min-h-screen bg-white  ">
      <Stories stories = {stories}/>
      { posts.length > 0 ? (
        //pt-0 is not 
        <div className="w-full p-4 pt-0 will-change-transform"> 
          {posts.map((post) => (
            <MemoizedPost key={post._id} post = {post} postId = {post._id}/>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">No posts available.</div>
      )}
    </div>
  );
}

export default Dashboard;