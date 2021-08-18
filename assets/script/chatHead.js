let socket = io();

if (!sessionStorage.getItem('id')) {
  window.location.replace('/login.html');
}
else {
  let socketId;
  let socketConnection = io.connect();
  socketConnection.on('connect', function(){
    socketId = socketConnection.socket.sessionid;
    socket.emit('newConnectedUser', sessionStorage.getItem('id'));
    console.log(socketId);
  })
  
}
