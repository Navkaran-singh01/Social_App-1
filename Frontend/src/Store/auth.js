import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';
import { useChatStore } from './chat';

export const useAuthStore = create((set,get) => ({
    user: null,
    isAuthenticated: false,
    loading: true,

    checkAuth: async () => {
        set({loading: true});
        try {
            const response = await axiosInstance.get('/checkAuth');
            set({ user: response.data.user, isAuthenticated: true });
            console.log("Authentication check successful:", response);

            useChatStore.getState().connectSocket();
        } catch (error) {
            console.error("Check Auth Error:", error);
            set({ user: null, isAuthenticated: false });
            set({loading: false});
        } finally {
            set({loading: false});
        }
    },

    signUp: async (formData) => {
        set({loading: true});
        try{
            const response = await axiosInstance.post('/signup', formData);
            console.log("Sign Up Successful:", response);
            set({ user: response.data.user, isAuthenticated: true });

            useChatStore.getState().connectSocket();
        }
        catch (error) {
            console.error("Sign Up Error:", error);
        } finally {
            set({loading: false});
        }
    },

    login: async (formData) => {
        set({loading: true});
        try {
            const response = await axiosInstance.post('/login', formData);
            console.log("Login Successful:", response);
            set({ user: response.data.user, isAuthenticated: true });

            useChatStore.getState().connectSocket();
        } catch (error) {
            console.error("Login Error:", error);
        } finally {
            set({loading: false});
        }
    },

    logout: async () => {
        set({loading: true});
        try {
            await axiosInstance.post('/logout');
            set({ user: null, isAuthenticated: false });
        } catch (error) {
            console.error("Logout Error:", error);
        } finally {
            set({loading: false});
        }
    },
}));