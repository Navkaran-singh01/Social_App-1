import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';

export const useInteractionStore = create((set) => ({
    likePost: async (postId) => {
        try {
            const response = await axiosInstance.post(`/interactions/likePost/${postId}`);
            console.log("Post liked successfully:", response);
            // Optionally, you can update the state here if needed
        } catch (error) {
            console.error("Error liking post:", error);
        }
    },

    savePost: async (postId) => {
        try {
            const response = await axiosInstance.put(`/interactions/savePost/${postId}`);
            console.log("Post Saved successfully:", response);
            // Optionally, you can update the state here if needed
        } catch (error) {
            console.error("Error Saving post:", error);
        }
    },

    commentPost: async (postId,mycomment) => {
        try {
            const response = await axiosInstance.post(`/interactions/commentPost/${postId}`,{content:mycomment});
            console.log("Post liked successfully:", response);
            // Optionally, you can update the state here if needed
        } catch (error) {
            console.error("Error liking post:", error);
        }
    },

    requestToFollow: async (followUserId) => {
        try {
            const response = await axiosInstance.put(`/interactions/requestToFollow/${followUserId}`);
            console.log("Post liked successfully:", response);
            // Optionally, you can update the state here if needed
        } catch (error) {
            console.error("Error liking post:", error);
        }
    },

    removeFromFollowers: async (otherUserId) => {
        try {
            console.log("Id to remove --> ",otherUserId);
            const response = await axiosInstance.put(`/interactions/removeFromFollowers/${otherUserId}`);
            console.log("UserRemoved Successfully:", response);
            // Optionally, you can update the state here if needed
        } catch (error) {
            console.error("Error liking post:", error);
        }
    },
    
}));