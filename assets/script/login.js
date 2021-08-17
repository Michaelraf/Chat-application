let socket = io();

let submit = document.querySelector('#submit');
let usernameInput = document.querySelector('#username');
let passwordInput = document.querySelector('#password');
let section = document.querySelector('section');
let connectedUsersList = document.querySelector('#connectedUsers ul');

submit.addEventListener('click', function (e) {
    e.preventDefault();

    fetch("http://192.168.10.41:1337/user/login", {
        method: "POST",
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: usernameInput.value, password: passwordInput.value })
    })
        .then(res => res.json())
        .then((res) => {
            if (res.success === true) {
                window.location.replace('/chat.html');
                sessionStorage.setItem('id', res.user_id);
            }
            else {
                let oldSpan = document.querySelector('span');
                if (oldSpan) {
                    section.removeChild(oldSpan);
                }
                let newSpan = document.createElement('span');
                newSpan.textContent = "No account found";
                newSpan.id = 'error';
                section.appendChild(newSpan);
            }
        })
        .catch(err => console.log("err : " + err));
});

