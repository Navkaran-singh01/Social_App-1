const express = require('express');
const { protect } = require('../Middeware/protect');
const { createPost, createStory } = require('../Controller/createControl');
const createRouter = express.Router();

createRouter.post('/createPost', protect,createPost);
createRouter.post('/createStory',protect,createStory);


module.exports = createRouter;
// This router handles the creation of posts. It uses the createPost function from the createControl