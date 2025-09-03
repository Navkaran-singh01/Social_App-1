const User = require('../Models/User');
const Comment = require('../Models/Comment');
const Post = require('../Models/Post');
const Like = require('../Models/Like');
const Story = require('../Models/Story');

exports.likePost = async (req, res) => {
    try{
        const userId = req.user.id;
        const postId = req.params.postId;
        if(!postId) {
            return res.status(400).json({ message: 'Post ID is required' });
        }
        const user = await User.findById({ _id: userId });
        if(!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const post = await Post.findById({_id: postId});
        if(!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        const existingLike = await Like.findOne({ post: postId, likeBy: userId });
        if(existingLike){
            await User.findByIdAndUpdate({ _id: userId }, { $pull: { likes: postId } }, { new: true });
            await Like.findByIdAndDelete({_id:existingLike._id});
            const updatedPost = await Post.findByIdAndUpdate({_id:post._id}, { $pull: { likes: userId } },{new:true});
            return res.status(200).json({ message: 'Post unliked successfully', updatedPost });
        }
        const newLike = await Like.create({
            post: postId,
            likeBy: userId
        })
        if(!newLike) {
            return res.status(500).json({ message: 'Error liking post' });
        }
        const updatedPost = await Post.findByIdAndUpdate(
            { _id: post._id },
            { $push: { likes: userId } },
            { new: true }
        );
        if(!updatedPost) {
            return res.status(500).json({ message: 'Error updating post likes' });
        }
        await User.findByIdAndUpdate(
            { _id: userId },
            { $push: { likes: postId } },
            { new: true }
        );
        res.status(200).json({ message: 'Post liked successfully', post: updatedPost });
    }
    catch (error) {
        console.error('Error liking post:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

exports.commentOnPost = async (req, res) => {
    try{
        const userId = req.user.id;
        const postId = req.params.postId;
        const {content} = req.body;
        if(!postId) {
            return res.status(400).json({ message: 'Post ID is required' });
        }
        if(!content) {
            return res.status(400).json({ message: 'Comment content is required' });
        }
        const user = await User.findById({ _id: userId });
        if(!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const post = await Post.findById({_id: postId});
        if(!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        const newComment  = await Comment.create({
            post: postId,
            commentBy: userId,
            content: content
        })
        if(!newComment) {
            return res.status(500).json({ message: 'Error creating commenting in database' });
        }
        const updatedPost = await Post.findByIdAndUpdate(
            { _id: post._id },
            { $push: { comments: newComment._id } },
            { new: true }
        );
        if(!updatedPost) {
            return res.status(500).json({ message: 'Error updating post comments' });
        }
        await User.findByIdAndUpdate(
            { _id: userId },
            { $push: { comments: postId } },
            { new: true }
        );
        res.status(200).json({ message: 'Comment added successfully', post: updatedPost, comment: newComment });
    }
    catch(err){
        console.error('Error commenting on post:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

exports.requestToFollow = async (req, res) => {
    try{
        const userId = req.user.id;
        const followUserId = req.params.followUserId;
        if(!followUserId) {
            return res.status(400).json({ message: 'Follow user ID is required' });
        }
        const userToFollow = await User.findById({ _id: followUserId });
        if(!userToFollow) {
            return res.status(404).json({ message: 'User to follow not found' });
        }
        const user = await User.findById({_id:userId});
        if(!user){
            return res.status(400).json({message: 'User Not found'});
        }
        let updatedUser = user;
        if(user.following.includes(followUserId)){
            await User.findByIdAndUpdate({_id:userToFollow._id} , {$pull : {followers:user._id} },{new:true});
            updatedUser = await User.findByIdAndUpdate({_id:user._id} , {$pull : {following : followUserId}},{new:true}).select('-password ');
            return res.status(201).json({message:"Unfollow is completed",updatedUser});
        }
        if(userToFollow.privacy !== "private"){
            await User.findByIdAndUpdate({_id:userToFollow._id} , {$push : {followers:user._id} },{new:true});
            updatedUser = await User.findByIdAndUpdate({_id:user._id} , {$push : {following : followUserId}},{new:true}).select('-password ');
            return res.status(201).json({message:"Follow request is completed",updatedUser});
        }
        const updatedToFollow = await User.findByIdAndUpdate({_id:userToFollow._id},{$push : {followRequests:user._id}},{new:true});
        if(!updatedToFollow){
            return res.status(404).json({ message: 'Error while request to user' });
        }
        return res.status(201).json({message:"Follow request is Sent",updatedUser});
    }
    catch(err){
        console.error('Error requesting to follow:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

exports.acceptFollow = async (req,res) => {
    try{
        const userId = req.user.id;
        const otherUserId = req.params.otherUserId;
        if(!otherUserId) {
            return res.status(400).json({ message: 'Follow user ID is required' });
        }
        const userToAccept = await User.findById({ _id: otherUserId });
        if(!userToAccept) {
            return res.status(404).json({ message: 'User to follow not found' });
        }
        const user = await User.findById({_id:userId});
        if(!user){
            return res.status(400).json({message: 'User Not found'});
        }
        const updateduser = await User.findByIdAndUpdate({_id:user._id} , {$pull: {followRequests:userToAccept._id},$push :{followers:userToAccept._id}},{new:true});
        await User.findByIdAndUpdate({_id:userToAccept._id},{$push:{following:user._id}},{new:true});
        if(!updateduser){
            return res.status(404).json({ message: 'Error while updating the Database' });
        }
        res.status(200).json({message:"Accepting Request is Succesfull"});
        
    }
    catch(err){
        console.error('Error Accepting the follow request:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

exports.removeFromFollowers = async (req,res) => {
    try{
        const userId = req.user.id;
        const otherUserId = req.params.otherUserId;
        if(!otherUserId) {
            return res.status(400).json({ message: 'Follow user ID is required' });
        }
        const userToRemove = await User.findById({ _id: otherUserId });
        if(!userToRemove) {
            return res.status(404).json({ message: 'User to follow not found' });
        }
        const user = await User.findById({_id:userId});
        if(!user){
            return res.status(400).json({message: 'You are Not found in the database'});
        }
        // if(user.followers.includes(otherUserId) === null){
        //     res
        // }
        const updatedUser = await User.findByIdAndUpdate({_id:user._id},{$pull : {followers:otherUserId}},{new:true});
        await User.findByIdAndUpdate({_id:userToRemove._id},{$pull:{following:user._id}},{new:true});
        if(!updatedUser){
            return res.status(404).json({ message: 'Error while updating the Database' });
        }
        res.status(200).json({message:"Removing from Following is Succesfull"});
    }
    catch(err){
        console.error('Error Accepting the follow request:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

exports.savePost = async (req, res) => {
    try{
        const userId = req.user.id;
        const postId = req.params.postId;
        if(!postId) {
            return res.status(400).json({ message: 'Post ID is required' });
        }
        const user = await User.findById({ _id: userId });
        if(!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const post = await Post.findById({_id: postId});
        if(!post) {
            return res.status(404).json({ message: 'Post not found' });
        }   
        const existingSavedPost = user.savedPosts.includes(postId);
        if(existingSavedPost) {
            await Post.findByIdAndUpdate(
                { _id: post._id },
                { $pull: { savedBy: userId } },
                { new: true }
            );
            const updatedUser = await User.findByIdAndUpdate(
                { _id: userId },
                { $pull: { savedPosts: postId } },
                { new: true }
            );
            if(!updatedUser) {
                return res.status(404).json({ message: 'Error while removing saved post' });
            }
            return res.status(200).json({ message: 'Post unsaved successfully', user: updatedUser });
        }
        await Post.findByIdAndUpdate(
            { _id: post._id },
            { $push: { savedBy: userId } },
            { new: true }
        );
        const updatedUser = await User.findByIdAndUpdate(
            { _id: userId },
            { $push: { savedPosts: postId } },
            { new: true }
        );
        if(!updatedUser) {
            return res.status(404).json({ message: 'Error while saving post' });
        }
        return res.status(200).json({ message: 'Post saved successfully', user: updatedUser });
    }
    catch(err){
        console.error('Error saving post:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

exports.likeStory = async (req, res) => {
    try{
        const userId = req.user.id;
        const storyId = req.params.storyId;
        if(!storyId) {
            return res.status(400).json({ message: 'Post ID is required' });
        }
        const user = await User.findById({ _id: userId });
        if(!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const story = await Story.findById({_id : storyId});
        if(!story) {
            return res.status(404).json({ message: 'Story not found' });
        }
        const existingLike = story.likes.includes(userId);
        if(existingLike){
            await Story.findByIdAndUpdate({_id:storyId} , {$pull : {likes : userId}},{new:true});
            return res.status(200).json({ message: 'Story unliked successfully' });
        }
        const updatedStory = await Story.findByIdAndUpdate(
            { _id: story._id },
            { $push: { likes: userId } },
            { new: true }
        );
        if(!updatedStory) {
            return res.status(500).json({ message: 'Error updating post likes' });
        }
        res.status(200).json({ message: 'Post liked successfully', story: updatedStory });
    }
    catch (error) {
        console.error('Error liking post:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}