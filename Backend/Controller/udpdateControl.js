const User = require('../Models/User');
const cloudinary = require('cloudinary').v2;

async function uploadFileToCloudinary(file,folder,quality) {
    const options = {folder};
    if(quality){
        options.quality = quality;
    }
    options.resource_type = "auto";
    return await cloudinary.uploader.upload(file.tempFilePath,options);
}

exports.updateProfile = async (req, res) => {
    try{
        const {id} = req.user; // Assuming user ID is stored in req.user
        const user = await User.findById({_id:id}).select('-password'); 
        if(!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const profilePicture= req.files?.profilePic; // Assuming you're using a file upload middleware like multer
        const { bio, username } = req.body; // Assuming bio and username are sent in the request body
        const supprortedFiles = ['jpeg', 'png', 'jpg'];
        if(profilePicture && !supprortedFiles.includes(profilePicture.mimetype.split('/')[1])) {
            return res.status(400).json({ message: 'Unsupported file type' });
        }
        if(username) {
            const existingUser = await User.find({ username }).select("-password");
            if(existingUser.length > 0 && existingUser[0]._id.toJSON() !== id) {
                return res.status(400).json({ message: 'Username already exists' ,existingUser :existingUser[0]});
            }
            user.username = username;
        }
        if(profilePicture) {
            // Assuming you have a function to upload to Cloudinary
            const cloudinaryResponse = await uploadFileToCloudinary(profilePicture,'Social_app');
            if(!cloudinaryResponse) {
                return res.status(500).json({ message: 'Error uploading to Cloudinary' });
            }
            user.profilePicture = cloudinaryResponse.secure_url; // Save the URL from Cloudinary
        }   
        if(bio) {
            user.bio = bio;
        }
        const updatedUser = await User.findByIdAndUpdate({ _id: user.id },{username:user.username, bio:user.bio, profilePicture:user.profilePicture},{new:true});
        if(!updatedUser) {
            return res.status(500).json({ message: 'Error updating profile' });
        }
        res.status(200).json({ message: 'Profile updated successfully', updatedUser });
    }
    catch(err){
        res.status(500).json({ message: 'internal profile', error: err.message });
    }
}