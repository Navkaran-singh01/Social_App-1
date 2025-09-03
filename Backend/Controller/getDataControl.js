const User = require("../Models/User");
const Post = require("../Models/Post");
const Story = require("../Models/Story");
const Chat = require("../Models/Chat");
const Message = require("../Models/Message");

exports.getPosts = async (req,res) => {
    try{
        const userId = req.user.id;
        const {skip = 0} = req.query;
        if(!userId){
            return res.json("userId is available");
        }
        const user = await User.findById({_id : userId});
        if(!user){
            return res.json("The User doesnot found");
        }
        const followings = user.following;
        // const posts = await Post.find({userid : {$in : followings}}).populate({path:"userid",select:"username _id profilePicture"});
        const postsWithOutPop = await Post.aggregate([
            {$match : {userid : {$in : followings}}},
            {$sample : { size : 100 }},
            {$skip : parseInt(skip)},
            {$limit : 5}
        ])
        const posts = await Post.populate(postsWithOutPop,{
            path:"userid",
            select:"username _id profilePicture"
        })
        if(!posts || posts.length === 0){
            return res.json("There is no posts available");
        }
        return res.json({message:"Fetching of posts is successful ! ",posts});
    }
    catch(err){
        console.error(err);
        return res.json("There is internal error while fetching posts");
    }
}

exports.getUserPosts = async (req, res) => {
    try{
        const userId = req.user.id;
        if(!userId){
            return res.status(400).json({ message: 'User ID is required' });
        }
        const user = await User.findById({_id: userId});
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }
        const posts = await Post.find({ userid: userId });
        if(!posts || posts.length === 0){
            return res.status(404).json({ message: 'No posts found for this user' });
        }
        res.status(200).json({ message: 'User posts fetched successfully', posts });
    }
    catch(err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

exports.getUserSavedPosts = async (req,res) => {
    try{
        const userId = req.user.id;
        if(!userId){
            return res.status(400).json({ message: 'User ID is required' });
        }
        const user = await User.findById({_id: userId});
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }
        const saveposts = user.savedPosts;
        const savedPosts = await Post.find({ _id : {$in : saveposts} }).populate({path:"userid",select:"username _id profilePicture"});
        if(!savedPosts || savedPosts.length === 0){
            return res.status(404).json({ message: 'No posts found for this user' });
        }
        res.status(200).json({ message: 'User posts fetched successfully', savedPosts });
    }
    catch(err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

exports.getFollowers = async (req, res) => {
    try{
        const userId = req.user.id;
        if(!userId){
            return res.status(400).json({ message: 'User ID is required' });
        }
        const user = await User.findById({_id: userId});
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }
        const followers = await User.find({ _id: { $in: user.followers } }).select('username profilePicture _id');
        if(!followers || followers.length === 0){
            return res.status(404).json({ message: 'No followers found for this user' });
        }
        res.status(200).json({ message: 'Followers fetched successfully', followers });
    }
    catch(err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

exports.getFollowing = async (req, res) => {
    try{
        const userId = req.user.id;
        if(!userId){
            return res.status(400).json({ message: 'User ID is required' });
        }
        const user = await User.findById({_id: userId});
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }
        const following = await User.find({ _id: { $in: user.following } }).select('username profilePicture _id');
        if(!following || following.length === 0){
            return res.status(404).json({ message: 'No following found for this user' });
        }
        res.status(200).json({ message: 'Following fetched successfully', following });
    }
    catch(err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

exports.getOtherUserDetails = async (req, res) => {
    try{
        const userId = req.user.id;
        const otherUserId = req.params.otherUserId;
        if(!otherUserId) {
            return res.status(400).json({ message: 'Other User ID is required' });
        }
        if(otherUserId === userId) {
            return res.status(400).json({ message: 'Cannot fetch details for the same user' });
        }

        if(!userId){
            return res.status(400).json({ message: 'User ID is required' });
        }
        const user = await User.findById({_id: userId}).select('username profilePicture bio followers following');
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }
        const otherUser = await User.findById({_id: otherUserId})
        .select('username profilePicture bio followers following posts privacy')
        .populate(
            [{
                path : "followers",
                select : "_id username profilePicture"
            },
            {
                path : "following",
                select : "_id username profilePicture"
            }]
        );
        const otherUserPosts = await Post.find({userid:otherUserId});
        if(!otherUser){
            return res.status(404).json({ message: 'Other user not found' });
        }
        const isFollowing = user.following.includes(otherUserId);
        if(isFollowing || otherUser.privacy === 'public') {
            return res.status(200).json({ message: 'Other user details fetched successfully', otherUser,otherUserPosts, isFollowing });
        }
        otherUser.followers = otherUser.followers.length;
        otherUser.following = otherUser.following.length;
        otherUser.posts = otherUser.posts.length;
        return res.status(200).json({ message: 'Other user details fetched successfully', otherUser, isFollowing: false });

    }
    catch(err) {
        console.error('Error fetching user details:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }   
}

exports.getUserDetails = async (req, res) => {
    try{
        const userId = req.user.id;
        if(!userId){
            return res.status(400).json({ message: 'User ID is required' });
        }
        const user = await User.findById({_id: userId}).select('-password -email -createdAt -updatedAt');
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }
        const getsum = await Chat.find({members:userId , [`unreadMessagesCount.${userId}`] : {$gt : 0}});
        const unreadMessageCount = getsum.length || 0;
        return res.status(200).json({ message: 'User details fetched successfully', user ,unreadMessageCount });
    }
    catch(err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

exports.getCommentsOnPost = async (req, res) => {
    try{
        const postId = req.params.postId;
        if(!postId) {
            return res.status(400).json({ message: 'Post ID is required' });
        }
        const post = await Post.findById(postId)
                                .populate({
                                    path: 'comments',
                                    populate: {
                                        path: 'commentBy',
                                        select: 'username profilePicture'
                                    }
                                });
        //comments can be fetched by find comments by postid in comment schema
        if(!post){
            return res.status(404).json({ message: 'Post not found' });
        }
        if(post.comments.length === 0){
            return res.status(404).json({ message: 'No comments found for this post' });
        }
        return res.status(200).json({ message: 'Comments fetched successfully', comments: post.comments });
    }
    catch(err) {
        console.error('Error fetching comments on post:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

exports.searchUser = async (req,res) => {
    try{
        const query = req.query.query;
        if(!query){
            return res.status(400).json({ error: "Query param is required" });
        }

        const users = await User.find({username : {$regex : query , $options: 'i'} })
                               .select("username profilePicture _id").limit(10);
        res.status(200).json({message : "Here are the users based on your search" ,users });
    }
    catch(err){
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

exports.searchChats = async (req,res) => {
    try{
        const userid = req.user.id;
        const query = req.query.query;
        if(!query){
            return res.status(400).json({ error: "Query param is required" });
        }

        const chatUsers = await User.find({
            username : {$regex : query , $options: 'i'},
            followers : userid,
            following : userid
        })
        .select("username profilePicture _id").limit(10);
        res.status(200).json({message : "Here are the users based on your search" , chatUsers });
    }
    catch(err){
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

exports.getStories = async (req,res) => {
    try{
        const id =  req.user.id;
        const user = await User.findById({_id:id});
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
        const userToFetch = [...user.following,user._id];
        const stories = await Story.find({
            userid : {$in : userToFetch},
            expiresAt : {$gt : new Date()},
            isArchived : false
        })
        .populate({
            path : "userid",
            select : "_id username profilePicture"
        })
        .sort({createdAt : -1});
        if(!stories){
            return res.status(404).json({ message: 'No Stories found ' });
        }
        return res.status(200).json({ message: 'Stories fetched successfully', stories });
    }
    catch(err){
        console.error('Error fetching Stories:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

exports.getArchievedStories = async (req,res) => {
    try{
        const id =  req.user.id;
        const user = await User.findById({_id:id});
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
        const stories = await Story.find({
            userid : id,
            isArchived : true
        })
        .sort({createdAt : -1});
        if(!stories){
            return res.status(404).json({ message: 'No Stories found ' });
        }
        return res.status(200).json({ message: 'Stories fetched successfully', archievedStories : stories });
    }
    catch(err){
        console.error('Error fetching Archieved Stories:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

exports.getUserChats = async (req,res) => {
    try{
        const userid = req.user.id;
        if(!userid){
            return res.status(401).json({message:"The userid is missing;"})
        }
        const userChats = await Chat.find(
            {members : userid}
        )
        .populate({
            path : "members",
            select : "_id username profilePicture"
        })
        .sort({lastMessageAt : -1})
        .lean()                             //This convert it to object so that we can easily apply filter and other functionality 
                                            //If we donot do that there is problem with the populated stuff it donot come in the filter
        userChats.forEach((chat)=>{
            chat.members = chat.members.filter((member) => member._id.toString() !== userid)
        })

        return res.status(201).json({message:"Chats fetched Succesfully" , userChats})
    }
    catch(err){
        console.error('Error fetching Chats:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

exports.getMessagesWithUser = async (req,res) => {
    try{
        const userid = req.user.id;
        console.log("THis is working");
        const chatId = req.params.chatId;
        console.log("chatId:", chatId);
console.log("userid:", userid);

if (!userid) {
    console.log("userid missing");
    return res.status(401).json({ message: "The userid is missing;" });
}

if (!chatId) {
    console.log("chatId missing");
    return res.status(401).json({ message: "The ChatId is missing;" });
}
        const areUnread = await Message.updateMany({chatId,readAt : null} ,{ readAt : new Date()})
        const isread = areUnread.matchedCount > 0 ? true : false;
        const messages = await Message.find({chatId});
        const chats = await Chat.findByIdAndUpdate(chatId,{$set:{[`unreadMessagesCount.${userid}`]:0}},{new:true})
        return res.status(201).json({message:"Message With User fetched Succesfully" , messages,isread})
    }
    catch(err){
        console.error('Error fetching Chat with user:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}