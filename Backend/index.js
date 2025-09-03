const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const {app,server} = require('./Network/socket')
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const router = require('./Routers/auth');
const db = require('./config/database');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const Router = require('./Routers/udpate');
const { cloudinaryConnect } = require('./config/cloudinary');
const createRouter = require('./Routers/create');
const interactionRouter = require('./Routers/interaction');
const getRouter = require('./Routers/getData');
const { archieveExpiredStories } = require('./Jobs/archieveExpiredStories');
const deleteRouter = require('./Routers/delete');

app.use(cors({
  origin: [process.env.CLIENT_URL,"http://localhost:3001"],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(cookieParser());
app.use(express.json());
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));
app.use('/api/v1', router);
app.use('/api/v1/update', Router);
app.use('/api/v1/create', createRouter);
app.use('/api/v1/delete',deleteRouter);
app.use('/api/v1/interactions', interactionRouter);
app.use('/api/v1/getData', getRouter);
cloudinaryConnect();
db.connectDB();
archieveExpiredStories();
cron.schedule('0 * * * *', ()=>{
  console.log("Running archieve job");
  archieveExpiredStories();
})

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});