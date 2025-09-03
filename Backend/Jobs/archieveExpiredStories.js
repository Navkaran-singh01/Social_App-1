const Story = require("../Models/Story");

exports.archieveExpiredStories = async(req,res) => {
    try{
        await Story.updateMany(
            {expiresAt : {$lt : new Date()} , isArchived:false},
            {$set : {isArchived : true}}
        );
        console.log("Expired stories moved to archive");
    }
    catch(error){
        console.error('Error Archieving Story:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

