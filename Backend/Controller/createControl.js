const User = require('../Models/User');
const Post = require('../Models/Post');
const Story = require('../Models/Story');
const cloudinary = require('cloudinary').v2;

async function uploadFileToCloudinary(file,folder,quality) {
    const options = {folder};
    if(quality){
        options.quality = quality;
    }
    options.resource_type = "auto";
    return await cloudinary.uploader.upload(file.tempFilePath,options);
}

exports.createPost = async (req, res) => {
    try{
        const {id} = req.user; // Assuming user ID is stored in req.user
        const content = req.files?.postFile; // Assuming you're using a file upload middleware like multer
        const { caption } = req.body
        if(!content) {
            return res.status(400).json({ message: 'Content (Image or Video) is required' });
        }
        if(!caption) {
            return res.status(400).json({ message: 'Caption is required' });
        }
        const user = await User.findById({ _id: id }).select('-password');
        if(!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const supportedFiles = ['jpeg', 'png', 'jpg', 'mp4', 'mov'];
        if(!supportedFiles.includes(content.mimetype.split('/')[1])) {
            return res.status(400).json({ message: 'Unsupported file type' });
        }
        const cloudinaryResponse = await uploadFileToCloudinary(content, 'Social_app');
        if(!cloudinaryResponse) {
            return res.status(500).json({ message: 'Error uploading to Cloudinary' });
        }
        const post = new Post({
            userid: id,
            content: cloudinaryResponse.secure_url, // Save the URL from Cloudinary
            caption: caption,
            likes: [],
            comments: [],
            savedBy: []
        })
        const savedPost = await post.save();
        if(!savedPost) {
            return res.status(500).json({ message: 'Error Saving post in the Database' });
        }
        await User.findByIdAndUpdate(
            { _id: id },
            { $push: { posts: savedPost._id } },
            { new: true }
        );
        res.status(201).json({ message: 'Post created successfully', post: savedPost });
    }
    catch (error) {
        console.error('Error creating post:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

exports.createStory = async (req,res) => {
    try{
        const {id} = req.user; // Assuming user ID is stored in req.user
        const content = req.files?.postFile; // Assuming you're using a file upload middleware like multer
        const { caption,contentType } = req.body
        if(!content) {
            return res.status(400).json({ message: 'Content (Image or Video) is required' });
        }
        const user = await User.findById({ _id: id }).select('-password');
        if(!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const supportedFiles = ['jpeg', 'png', 'jpg', 'mp4', 'mov'];
        if(!supportedFiles.includes(content.mimetype.split('/')[1])) {
            return res.status(400).json({ message: 'Unsupported file type' });
        }
        const cloudinaryResponse = await uploadFileToCloudinary(content, 'Social_app');
        if(!cloudinaryResponse) {
            return res.status(500).json({ message: 'Error uploading to Cloudinary' });
        }
        const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 24 hours from now
        const story = new Story({
            userid: id,
            content: cloudinaryResponse.secure_url, // Save the URL from Cloudinary
            caption: caption,
            contentType,
            likes:[],
            isArchived:false,
            expiresAt
        })
        const savedStory = await story.save();
        if(!savedStory) {
            return res.status(500).json({ message: 'Error Saving post in the Database' });
        }
        await User.findByIdAndUpdate(
            { _id: id },
            { $push: { storys: savedStory._id } },
            { new: true }
        );
        res.status(201).json({ message: 'Story created successfully', story: savedStory });

    }
    catch(error){
        console.error('Error creating Story:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}