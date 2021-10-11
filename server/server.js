const dotenv = require('dotenv')
dotenv.config();
const express = require('express');
const port = process.env.PORT || 8000;
const app = express();
const cors = require('cors');
const CONNECTION = require('./db/connection.js');
const authRouter = require('./routes/auth.js');
const privateRouter = require('./routes/private.js');
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server,{
    cors:{
        origin:'http://127.0.0.1:5000',
        methods:['GET','POST','PUT','PATCH']
    }
});

const socketListeners = require('./service/socket.io_listeners.js');

// ! mongodb connection !!
CONNECTION();

// ! middlewares
app.use(express.json());
app.use(express.urlencoded({ extended:false}));

// * cors for cross-origin requests
app.use(cors());

// ! setting up routers
app.use('/api/auth',authRouter);
app.use('/api/private',privateRouter);


// ! listening app
server.listen(port,()=>{
    console.log('listening on port',port);
});


socketListeners(io);

