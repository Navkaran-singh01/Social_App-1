import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';

export const useCreateStore = create((set,get) => ({
    createPost : async (formData) => {
        try{
            const response = axiosInstance.post("/create/createPost", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            console.log("This is the response to create post : ",response);
            return response;
        }
        catch(err){
            console.error("Error while creating the post : ",err);
        }
    },
    createStory : async (formData) => {
        try{
            const response = axiosInstance.post("/create/createStory", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            console.log("This is the response to create post : ",response);
            return response;
        }
        catch(err){
            console.error("Error while creating the post : ",err);
        }
    }
}));