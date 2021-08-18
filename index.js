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
    console.log(socket.id+' is connected');
    socket.on('chat message', (msg)=>{
        io.emit('chat message', msg);
    });
    socket.on('disconnect', ()=>{
        console.log(socket.id + ' disconnected');
       /*  userController.logout({ userId : connectedUserId, socketId: socket.id}); */
    });
    socket.on('newConnectedUser', function(id){
        io.emit('newConnectedUser', id);
    })
});

server.listen(PORT, ()=>{
    console.log('listening on ' + PORT);
});