import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';

export const useDataStore = create((set,get) => ({
    dataLoading: true,
    otherUserData:null,
    otherUserId : null,
    searchLoading:false,
    posts: [],
    stories:[],
    archievedStories:[],
    following:[],
    followers:[],
    searchResults:[],
    searchChats:[],

    // CommentsOnPost: {},

    //This is for the all posts  
    // getPosts: async () => {
    //     set({dataLoading: true});
    //     try {
    //         const response = await axiosInstance.get('/getData/getPosts');
    //         console.log("Response fetched successfully:", response);
    //         if (response.data.posts.length === 0) {
    //             console.log("No posts available.");
    //         }
    //         set({ posts: response.data.posts });
    //     } catch (error) {
    //         console.error("Get Posts Error:", error);
    //     } finally {
    //         set({dataLoading: false});
    //     }
    // },

    //This is the for the posts with limit 5

    getPosts: async (append,skip) => {
        set({dataLoading: true});
        try {
            const response = await axiosInstance.get(`/getData/getPosts?skip=${skip}`);
            console.log("Response fetched successfully:", response);
            const newPosts = response.data.posts || [];
            if (response.data.posts.length === 0) {
                console.log("No posts available.");
            }
            let unique = newPosts;
            set((state)=>{
                const existingPosts = state.posts;

                // Filter newPosts to exclude duplicates (based on _id)
                const uniqueNewPosts = newPosts.filter(
                    (newPost) => !existingPosts.some((existingPost) => existingPost._id === newPost._id)
                );
                unique = uniqueNewPosts;
                return {
                    posts: append ? [...existingPosts, ...uniqueNewPosts] : newPosts,
                };
            });
            return unique;
        } catch (error) {
            console.error("Get Posts Error:", error);
        } finally {
            set({dataLoading: false});
        }
    },

    

    // The problem we are getting with this --> it re-renders every post if we call it for one Post
    // and Another problem is it does the re-render and it is like refreshes the page

    // getCommentsOnPost: async (postId) => {
    //     set({dataLoading: true});
    //     try {
    //         const response = await axiosInstance.get(`/getData/getCommentsOnPost/${postId}`);
    //         console.log("Comments fetched successfully:", response);
    //         // set((state)=>({ CommentsOnPost : {
    //         //     ...state.CommentsOnPost,
    //         //     [postId] : response.data.comments
    //         // } }));
    //         // console.log("Comments for post:", postId, "are:", get().CommentsOnPost[postId]);
    //         return response.data.comments;
    //     } catch (error) {
    //         console.error("Get Comments Error:", error);
    //     } finally {
    //         set({dataLoading: false});
    //     }
    // },
    
    setOtherUserId: (otherUserid)=>{
        console.log("Lets see --> ",otherUserid);
        set({otherUserId:otherUserid});
        console.log("Other user id is set : ",get().otherUserId);
    },

    getOtherUserDetails: async()=>{
        set({dataLoading: true});
        try {
            const otherUserId = get().otherUserId;
            const response = await axiosInstance.get(`/getData/getOtherUserDetails/${otherUserId}`);
            console.log("Comments fetched successfully:", response);
            set({otherUserData:response.data});

        } catch (error) {
            console.error("Get Comments Error:", error);
        } finally {
            set({dataLoading: false});
        }
    },

    getFollowers : async() => {
        try{
            const response = await axiosInstance.get("/getData/getFollowers");
            console.log(response.data.followers);
            set({followers:response.data.followers});
        }
        catch(error){
            console.error("Get Follwers Error:", error);
        }
    },

    getFollowing : async() => {
        try{
            const response = await axiosInstance.get("/getData/getFollowing");
            console.log(response.data.following);
            set({following:response.data.following});
        }
        catch(error){
            console.error("Get Follwers Error:", error);
        }
    },

    searchUsers: async(query) => {
        if(!query || query.trim() === ""){
            set({searchResults:[]});
            return;
        }

        try{
            set({searchLoading:true});
            const response = await axiosInstance.get(`/getData/searchUser?query=${query}`);
            set({searchResults:response.data.users,searchLoading:false})
        }
        catch(err){
            console.error("Search error:", err);
            set({ searchResults: [], searchLoading: false });
        }
    },

    getsearchUsers: async(query) => {
        if(!query || query.trim() === ""){
            set({searchChats:[]});
            return;
        }

        try{
            set({searchLoading:true});
            const response = await axiosInstance.get(`/getData/getsearchChats?query=${query}`);
            set({searchChats:response.data.chatUsers,searchLoading:false})
        }
        catch(err){
            console.error("Search error:", err);
            set({ searchChats: [], searchLoading: false });
        }
    },

    setSearchLoading : (is)=> set({searchLoading:is}),

    clearSearch: () => set({ searchResults: [] }),
    clearSearchChats : () => set({ searchChats : []}),

    getStories: async () => {
        set({dataLoading: true});
        try {
            const response = await axiosInstance.get('/getData/getStories');
            console.log("Response fetched successfully:", response);
            if (response.data.stories.length === 0) {
                console.log("No Story available.");
            }
            set({ stories: response.data.stories });
        } catch (error) {
            console.error("Get Posts Error:", error);
        } finally {
            set({dataLoading: false});
        }
    },

    getArchievedStories: async () => {
        set({dataLoading: true});
        try {
            const response = await axiosInstance.get('/getData/getArchievedStories');
            console.log("Response fetched successfully:", response);
            if (response.data.archievedStories.length === 0) {
                console.log("No Story available.");
            }
            set({ archievedStories: response.data.archievedStories });
        } catch (error) {
            console.error("Get Posts Error:", error);
        } finally {
            set({dataLoading: false});
        }
    },

}));