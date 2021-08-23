const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const PORT = 1337;
const user = require('./user/user.router');
const message = require('./message/message.router');
const db = require('mongoose');
const dbUrl = "mongodb://localhost:27017/chatApp";
const { Server } = require("socket.io");
const io = new Server(server);
const userController = require('./user/user.controller')
let socketsTable = {};

// const dbServer = "mongodb://ADMIN:azerty007@host:port/dbname";

db.Promise = global.Promise;
db.connect(dbUrl, {
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(() => {
    console.log("DBconnected");
}).catch((err) => {
    console.log("Erreur", err);
})


app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use('/user', user);
app.use('/message', message);
app.use(express.static(process.cwd()));
app.get('/', (req, res)=>{
    res.sendFile(process.cwd()+'/login.html');
});

io.on('connection', (socket)=>{
    console.log(socket.id +' is connected');
    socket.on('chat message', (msg)=>{
        io.emit('chat message', msg);
    });
    socket.on('disconnect', ()=>{
        let socketId = socket.id;
        userController.delete_socket(socketsTable[socketId], socketId);
        delete(socketsTable[socketId]);
        io.emit('anUserDeconnected', socketId);
    });
    socket.on('newConnectedUser', function(id){
        io.emit('new_Connected_User', {userId: id, socketId: socket.id });
        socketsTable[socket.id] = id;
    });
});

server.listen(PORT, ()=>{
    console.log('listening on ' + PORT);
});