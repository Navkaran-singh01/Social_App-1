const userSocketMap  = new Map();

exports.addUserSocket = (userId, socketId) => {
  userSocketMap.set(userId.toString(), socketId);
};

exports.removeUserSocket = (userId) => {
  userSocketMap.delete(userId.toString());
};

exports.getSocketId = (userId) => {
  return userSocketMap.get(userId.toString());
};

exports.getOnlineUsers = (userId) => {
  const userids = [];
  for (const userid of userSocketMap.keys()){
    if(userid !== userId){
      userids.push(userid)
    }
  }
  return userids;
}