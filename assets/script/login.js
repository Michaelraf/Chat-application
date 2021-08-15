let socket = io();
// let xhr = new XMLHttpRequest();

let submit = document.querySelector('#submit');
let usernameInput = document.querySelector('#username');
let passwordInput = document.querySelector('#password');
let section = document.querySelector('section');

submit.addEventListener('click', function(e){
    e.preventDefault();
    socket.emit('login',{username: usernameInput.value, password : passwordInput.value});
});

socket.on('loginFailed', function(){
    let oldSpan = document.querySelector('span');
    if(oldSpan){
        section.removeChild(oldSpan);
    }
    let newSpan = document.createElement('span');
    newSpan.textContent = "No account found";
    newSpan.id = 'error';
    section.appendChild(newSpan);
});
socket.on('loginSucceded', function(data){
    sessionStorage.setItem('id', data._id);
    window.location.replace('/chat.html');
});