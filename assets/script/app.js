/* let socket = io(); */

let messages = document.getElementById('messages');
let form = document.getElementById('form');
let input = document.getElementById('input');

localStorage.clear();
form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (input.value) {
        socket.emit('chat message', { message: input.value, id: sessionStorage.getItem('id')});
        input.value = '';
    }
});

socket.on('chat message', function (userMsg) {
    let item = document.createElement('li');
    if (userMsg.id === sessionStorage.getItem('id')) {
        item.classList.add('clientSide')
    }
    else {
        item.classList.add('nonClientSide')
    }
    item.textContent = userMsg.message;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

socket.on('newConnectedUser', function(data){
    
})