let socket = io();

if (!sessionStorage.getItem('id')) {
  window.location.replace('/login.html');
} else {
  socket.emit('loggedIn');
}