import {create} from 'zustand';
import { io } from 'socket.io-client';
import { axiosInstance } from '../lib/axios';
import { useUserDataStore } from './userData';
import { useMediaSoupStore } from './mediaSoup';
import { consumeMedia } from '../lib/mediaSoup/consumeMedia';

export const useChatStore = create((set,get)=>({
    socket:null,
    userChats:[],
    selectedChat:null,
    messages:[],
    // selectedChatId : null,
    chatsLoading:false,
    onlineUser:[],

    connectSocket : () => {
        if(get().socket?.connected) return ;

        const socket = io("http://localhost:4000",{
            withCredentials:true
        });

        set({socket});
        console.log("Here is the connected Socket --> ",get().socket);

        socket.on("onlineUsers",(onlineuser)=>{
            set({onlineUser : onlineuser})
            console.log("The online Users are --> ",get().onlineUser)
        })

        socket.on("newMessage",(message)=>{
            console.log("New Message is --> ",message);
            set((state) => {
                const updatedMessages = [...state.messages,message].sort(
                    (a,b) => a.createdAt.localeCompare(b.createdAt)
                )
                return {messages : updatedMessages};
            })
            console.log("The messages --> ",get().messages)
        })

        socket.on("updateChats",(updatedChats) => {
            console.log("Updated Chats are --> ",updatedChats);
            if(get().messages.length === 1 && get().selectedChat?.members && !get().selectedChat._id) get().setSelectedChat(updatedChats);
            set((state)=>{
                const filtered = state.userChats.filter((chat)=>
                    chat._id !== updatedChats._id
                )
                return {userChats : [updatedChats,...filtered]};
            })
            // if(updatedChats._id !== get().selectedChat?._id) useUserDataStore.getState().setMessageNotification(false);
        })

        socket.on("isInc",(isInc)=>{
            console.log("IsInc value --> ",isInc);
            const chatId = get().selectedChat;
        if(chatId && (!isInc || chatId._id !== isInc)) console.log("Here is the Chat id --> ",chatId._id);
            else useUserDataStore.getState().setMessageNotification(false);
        })

        //For mediaSoup
        socket.on("mediaSoup:newProducer",async({producerId,kind,socketId})=>{
            const {recvTransport,device} = useMediaSoupStore.getState();
            console.log("getting the media --> ");
            if(!recvTransport) return;
            console.log("Get the media of other user and have receive transport")
            const chatId = get().selectedChat._id;
            const consumer = await consumeMedia({
                chatId,
                recvTransport,
                device,
                producerId,
                socketId
            })
        })

        socket.on("mediaSoup:userLeft",({socketId})=>{
            console.log("The user with socket id ",socketId," leave the Call");

            useMediaSoupStore.getState().removeConsumerBySocketId(socketId);
        })

        socket.on("mediaSoup:IncomingCall",({CallerDetail,chatId})=>{
            useUserDataStore.getState().setIncomingCall({
                CallerDetail,
                chatId
            })
        });

        socket.on("error",({message})=>{
            console.log("The error is --> ",message);
        })
    },
    sendNewMessage : (text) =>{
        const {socket , selectedChat} = get();
        const receiverId = selectedChat.members[0]._id
        if(!socket) return;
        socket.emit("sendMessage",({
            text,
            receiverId,
            selectedChat
        }));
    },
    getUserChats : async () => {
        set({chatsLoading: true});
        try {
            const response = await axiosInstance.get(`/getData/getUserChats`);
            console.log("Response fetched successfully:", response);
            if (response.data.userChats.length === 0) {
                console.log("No Story available.");
            }
            set({ userChats: response.data.userChats });
        } catch (error) {
            console.error("Get Posts Error:", error);
            set({chatsLoading: false});
        } finally {
            set({chatsLoading: false});
        }
    },
    getMessagesWithUser: async (chatId) => {
        set({chatsLoading: true});
        try {
            const response = await axiosInstance.get(`/getData/getMessagesWithUser/${chatId}`);
            console.log("Messages ----- fetched successfully:", response);
            //This is for the user if he initiated the chat 
            response.data.isread && useUserDataStore.getState().setMessageNotification(true) ;
            if (response.data.messages.length === 0) {
                console.log("No Story available.");
            }
            set({ messages: response.data.messages });
            get().setUnreadMessage();
        } catch (error) {
            console.error("Get Posts Error:", error);
            set({ messages: [] });
            set({chatsLoading: false});
        } finally {
            set({chatsLoading: false});
        }
    },

    setUnreadMessage : () => {
        set((state)=>({
            userChats : state.userChats.map((chat)=>{
                if(chat._id === state.selectedChat?._id){
                    return {
                        ...chat,
                        unreadMessagesCount : {
                            ...chat.unreadMessagesCount,
                            [useUserDataStore.getState().userData._id] : 0
                        }
                    }
                }
                return chat;
            })
        }))
    },


    setSelectedChat : (chat) => set({selectedChat : chat})
}))