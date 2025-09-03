const Comment = require("../Models/Comment");
const Like = require("../Models/Like");
const Post = require("../Models/Post");
const User = require("../Models/User");

exports.deletePost = async(req,res) => {
    try{
        const userId = req.user.id;
        const postId = req.params?.postId;
        if(!userId || !postId){
            return res.status(401).json({message : "The data is missing "});
        }
        const user = await User.findById({_id : userId});
        if(!user){
            return res.status(401).json({message : "User doesnot exist "});
        }
        // // 1. Get all comment and like IDs related to the post
        // const comments = await Comment.find({ postId: postId });
        // const likes = await Like.find({ postId: postId });

        // const commentIds = comments.map(c => c._id);
        // const likeIds = likes.map(l => l._id);

        // 2. Delete the actual comment and like documents
        await Comment.deleteMany({ post : postId });
        await Like.deleteMany({ post : postId });

        // 3. Remove those IDs from all users' comments[] and likes[]
        await User.updateMany(
            { comments: postId },
            { $pull: { comments: postId } }
        );

        await User.updateMany(
            { likes: postId },
            { $pull: { likes: postId } }
        );

        // 4. Remove post from user's own posts and savedPosts
        await User.findByIdAndUpdate(userId, { $pull: { posts: postId } });
        await User.updateMany({savedPosts : postId},{$pull : {savedPosts : postId}})
        const post = await Post.deleteOne({_id : postId , userid : userId});
        console.log("The post that is deleted ",post);
        return res.json({message:"I think the post should be deleted ",post})
    }
    catch (error) {
        console.error('Error deleting post:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}