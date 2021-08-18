let messagesContainer = document.getElementById('messagesContainer');
let messages = document.getElementById('messages');
let form = document.getElementById('form');
let input = document.getElementById('input');
let messagesContent = document.getElementById('messagesContent');
let connectedUsers = [];
let listOfConnectedUsers = document.querySelector('#connectedUsers ul');
let ip = "192.168.10.41";
let port = 1337;

// Ajout des anciens message dès connexion

fetch("http://" + ip + ":" + port + "/message/getAll", {
    method: "GET",
    headers: {
        'Accept': 'application/json , text/plain, */*',
        'Content-Type': 'application/json'
    }
})
    .then(res => res.json())
    .then((res) => {
        console.log(res);
    })
    .catch((err) => {
        console.log("err : " + err);
    });

form.addEventListener('submit', function (e) {
    e.preventDefault();
    let msg = input.value;
    let time = Date.now();
    if (msg) {
        fetch("http://" + ip + ":" + port + "/message/create/" + sessionStorage.getItem('id'), {
            method: "POST",
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content: msg, created_on: time })
        })
            .then(res => res.json())
            .then((res) => {

                if (res.success === true) {
                    socket.emit('chat message', { message: msg, id: sessionStorage.getItem('id'), created_on: time });
                    input.value = '';
                }
                else {
                    let oldSpan = document.querySelector('span#error');
                    if (oldSpan) {
                        messagesContainer.removeChild(oldSpan);
                    }
                    let newSpan = document.createElement('span');
                    newSpan.textContent = "Can't send message";
                    newSpan.id = 'error';
                    messagesContainer.appendChild(newSpan);
                }
            })
            .catch(err => console.log("err : " + err));
    }

});

socket.on('newConnected_User', function (id) {
    
    fetch("http://" + ip + ":" + port + "/user/connectedUsers", {
        method: "GET",
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then((res) => {
            //Removing all the li in ul before append new element
            listOfConnectedUsers.innerHTML = '';
            for (let i = 0; i < res.data.length; i++) {
                connectedUsers[i] = document.createElement('li');
                connectedUsers[i].innerHTML = "<p>" + res.data[i].username + "</p>" + '<div></div>';
                listOfConnectedUsers.appendChild(connectedUsers[i]);
            }
        })
        .catch((err) => {
            console.log('error : ' + err);
        });

});


socket.on('chat message', function (userMsg) {
    let date = new Date(userMsg.created_on);
    let sender = document.createElement('li');
    sender.classList.add('sender');
    if (userMsg.id != sessionStorage.getItem('id')) {

        fetch("http://" + ip + ":" + port + "/user/getUser/" + userMsg.id, {
            method: "GET",
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then((res) => {
                sender.textContent = res.data.username + " " + date.getHours() + ":" + date.getMinutes();
                sender.classList.add('nonClientSide');
                let item = document.createElement('li');
                item.classList.add('nonClientSide');
                item.textContent = userMsg.message;
                messages.appendChild(sender);
                messages.appendChild(item);
                messagesContent.scrollTop = messagesContent.scrollHeight;
            })
            .catch((err) => {
                console.log('err : ' + err);
            })
    }
    else {
        sender.textContent = date.getHours() + ":" + date.getMinutes();
        sender.classList.add('clientSide');
        let item = document.createElement('li');
        item.classList.add('clientSide');
        item.textContent = userMsg.message;
        messages.appendChild(sender);
        messages.appendChild(item);
        messagesContent.scrollTop = messagesContent.scrollHeight;
    }
});

