const express = require("express");
const { deletePost } = require("../Controller/deleteControl");
const { protect } = require("../Middeware/protect");
const deleteRouter = express.Router();

deleteRouter.delete("/deletePost/:postId",protect ,deletePost);

module.exports = deleteRouter;