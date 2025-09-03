import {create} from 'zustand';

export const useMediaSoupStore = create((set,get) => ({
    device:null,
    sendTransport:null,
    recvTransport:null,
    producers:[],
    consumers:[],
    existingUsers:[],
    setDevice: (device)=>set({device}),
    setExistingUsers: (existingUsers)=>set({existingUsers}),
    setSendTransport: (transport)=>set({sendTransport:transport}),
    setRecvTransport: (transport)=>set({recvTransport:transport}),
    addProducer: (producer)=>set((state)=>({producers:[...state.producers,producer]})),
    addConsumer: (consumer)=>set((state)=>({consumers:[...state.consumers,consumer]})),
    removeConsumerBySocketId: (socketId)=>{
        set((state)=>({
            consumers : state.consumers.filter(
                consumer => consumer.appData?.socketId !== socketId
            )
        }));
    },
    resetMediaSoup: ()=>set({
        device:null,
        sendTransport:null,
        recvTransport:null,
        producers:[],
        consumers:[],
        existingUsers:[]
    }),
}));