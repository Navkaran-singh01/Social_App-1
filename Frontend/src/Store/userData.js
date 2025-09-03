import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';

export const useUserDataStore = create((set,get) => ({
    userData: null,
    messageNotification:null,
    IncomingCall : null,
    userPosts: [],
    userSavedPosts:[],
    getUserData: async () => {
        try {
            const response = await axiosInstance.get('/getData/getUserDetails');
            set({ userData: response.data.user });
            set({messageNotification:response.data.unreadMessageCount});
            console.log("User Response fetched successfully:",response );
            console.log("Unread Messages fetched successfully:",get().messageNotification );
            console.log("User data fetched successfully:",get().userData );
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    },
    getUserPosts: async () => {
        try{
            const response = await axiosInstance.get('/getData/getUserPosts');
            set({userPosts:response.data.posts});
            console.log("Here are the user Posts : ",response.data.posts)
            console.log("User Posts response are : ",response);
        }
        catch(error) {
            console.error("Error fetching the user posts: ",error);
        }
    },
    getUserSavedPosts: async () => {
        try{
            const response = await axiosInstance.get('/getData/getUserSavedPosts');
            set({userSavedPosts:response.data.savedPosts});
            console.log("Here are the user Saved Posts : ",response.data.savedPosts)
            console.log("User Saved Posts response are : ",response);
        }
        catch(error) {
            console.error("Error fetching the user posts: ",error);
        }
    },
    setMessageNotification : (dec) => {
        set((state)=>({messageNotification : dec ?state.messageNotification-1 : state.messageNotification+1}));
        console.log("The value is of messageNotification --> ",get().messageNotification);
    },

    setIncomingCall : (callDetail) => set({IncomingCall:callDetail})

}));