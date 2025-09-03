const express = require("express");
const { getPosts, getUserPosts, getFollowers, getFollowing, getOtherUserDetails, getUserDetails, getCommentsOnPost, getUserSavedPosts, searchUser, getStories, getArchievedStories, getUserChats, getMessagesWithUser, searchChats } = require("../Controller/getDataControl");
const { protect } = require("../Middeware/protect");
const getRouter = express.Router()

getRouter.get("/getPosts",protect, getPosts);
getRouter.get("/getUserPosts", protect, getUserPosts);
getRouter.get("/getUserSavedPosts", protect, getUserSavedPosts);
getRouter.get("/getFollowers", protect, getFollowers);
getRouter.get("/getFollowing", protect, getFollowing);
getRouter.get("/getOtherUserDetails/:otherUserId", protect, getOtherUserDetails);
getRouter.get("/getUserDetails", protect, getUserDetails);
getRouter.get("/searchUser", protect, searchUser);
getRouter.get("/getsearchChats", protect, searchChats);
getRouter.get("/getCommentsOnPost/:postId", protect, getCommentsOnPost);

getRouter.get("/getStories",protect,getStories);
getRouter.get("/getArchievedStories",protect,getArchievedStories);

getRouter.get("/getUserChats",protect,getUserChats);
getRouter.get("/getMessagesWithUser/:chatId", protect, getMessagesWithUser);

module.exports = getRouter;