const express = require('express');
const Router = express.Router();
const { updateProfile } = require('../Controller/udpdateControl');
const { protect } = require('../Middeware/protect');
Router.put('/updateProfile',protect, updateProfile);
module.exports = Router;
// This router handles the profile update functionality for users. It uses the updateProfile function from the