import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';

export const useDeleteStore = create((set,get) => ({
    deletePost : async (postId) => {
        try{
            const response = axiosInstance.delete(`/delete/deletePost/${postId}`)
            console.log("This is the response to delete post : ",response);
            return response;
        }
        catch(err){
            console.error("Error while deleting the post : ",err);
        }
    }
}))