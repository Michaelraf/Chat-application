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
        for(let m of res.data){
            sender = document.createElement('li');
            sender.classList.add('sender');
            let msgDate = '';
            if (m.created_on.split(' ')[3] != Date().split(' ')[3]) {
                msgDate = m.created_on.split(' ')[0] + ' ' + m.created_on.split(' ')[2] + ' ' + m.created_on.split(' ')[1] + ' '
                    + m.created_on.split(' ')[3] + ' ' + m.created_on.split(' ')[4].split(':')[0] + ':' + m.created_on.split(' ')[4].split(':')[1];
            }
            else if (m.created_on.split(' ')[1] != Date().split(' ')[1]) {
                msgDate = m.created_on.split(' ')[0] + ' ' + m.created_on.split(' ')[2] + ' ' + m.created_on.split(' ')[1] + ' '
                    + m.created_on.split(' ')[4].split(':')[0] + ':' + m.created_on.split(' ')[4].split(':')[1];
            }
            else if (m.created_on.split(' ')[0] != Date().split(' ')[0]) {
                msgDate = m.created_on.split(' ')[0] + ' ' + m.created_on.split(' ')[4].split(':')[0] + ':' + m.created_on.split(' ')[4].split(':')[1];
            }
            else{
                msgDate = m.created_on.split(' ')[4].split(':')[0] + ':' + m.created_on.split(' ')[4].split(':')[1];
            }
            if(m.user_id._id !== sessionStorage.getItem('id')){
                sender.textContent = m.user_id.username + ' ' + msgDate;
                sender.classList.add('nonClientSide');
                let item = document.createElement('li');
                item.classList.add('nonClientSide');
                item.textContent = m.content;
                messages.appendChild(sender);
                messages.appendChild(item);
                messagesContent.scrollTop = messagesContent.scrollHeight;
            }
            else{
                sender.textContent = msgDate;
                sender.classList.add('clientSide');
                let item = document.createElement('li');
                item.classList.add('clientSide');
                item.textContent = m.content;
                messages.appendChild(sender);
                messages.appendChild(item);
                messagesContent.scrollTop = messagesContent.scrollHeight;
            }
        }
    })
    .catch((err) => {
        console.log("err : " + err);
    });

// Au cours de l'envoie d'un message
form.addEventListener('submit', function (e) {
    e.preventDefault();
    let msg = input.value;
    let time = Date();
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

socket.on('new_Connected_User', function (ids) {
    if (ids.userId === sessionStorage.getItem('id')) {

        fetch("http://" + ip + ":" + port + "/user/setSocket/" + ids.userId + "/" + ids.socketId, {
            method: "PUT",
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then((res) => {
                console.log(res);

            })
            .catch((err) => {
                console.log(err);
            });
    }

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
        });

});


socket.on('anUserDeconnected', function () {
    fetch("http://" + ip + ":" + port + "/user/connectedUsers", {
        method: "GET",
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then((res) => {
            //Removing all the li in ul before appending new element
            listOfConnectedUsers.innerHTML = '';
            for (let i = 0; i < res.data.length; i++) {
                connectedUsers[i] = document.createElement('li');
                connectedUsers[i].innerHTML = "<p>" + res.data[i].username + "</p>" + '<div></div>';
                listOfConnectedUsers.appendChild(connectedUsers[i]);
            }
        })
        .catch((err) => {
        });
});

socket.on('chat message', function (userMsg) {
    let date = Date(userMsg.created_on);
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
                let msgDate = '';
                if (date.split(' ')[3] != Date().split(' ')[3]) {
                    msgDate = date.split(' ')[0] + ' ' + date.split(' ')[2] + ' ' + date.split(' ')[1] + ' '
                        + date.split(' ')[3] + ' ' + date.split(' ')[4];
                }
                else if (date.split(' ')[1] != Date().split(' ')[1]) {
                    msgDate = date.split(' ')[0] + ' ' + date.split(' ')[2] + ' ' + date.split(' ')[1] + ' '
                        + date.split(' ')[4];
                }
                else if (date.split(' ')[0] != Date().split(' ')[0]) {
                    msgDate = date.split(' ')[0] + ' ' + date.split(' ')[2] + ' ' + ' '
                        + date.split(' ')[4];
                }
                else{
                    msgDate = date.split(' ')[4].split(':')[0] + ':' + date.split(' ')[4].split(':')[1];
                }
                sender.textContent = res.data.username + " " + msgDate;
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
        
        if (date.split(' ')[3] != Date().split(' ')[3]) {
            msgDate = date.split(' ')[0] + ' ' + date.split(' ')[2] + ' ' + date.split(' ')[1] + ' '
                + date.split(' ')[3] + ' ' + date.split(' ')[4];
        }
        else if (date.split(' ')[1] != Date().split(' ')[1]) {
            msgDate = date.split(' ')[0] + ' ' + date.split(' ')[2] + ' ' + date.split(' ')[1] + ' '
                + date.split(' ')[4];

        }
        else if (date.split(' ')[0] != Date().split(' ')[0]) {
            msgDate = date.split(' ')[0] + ' ' + date.split(' ')[2] + ' '
                + date.split(' ')[4];
        }
        else{
            msgDate = date.split(' ')[4].split(':')[0] + ':' + date.split(' ')[4].split(':')[1];
        }

        sender.textContent = msgDate;
        sender.classList.add('clientSide');
        let item = document.createElement('li');
        item.classList.add('clientSide');
        item.textContent = userMsg.message;
        messages.appendChild(sender);
        messages.appendChild(item);
        messagesContent.scrollTop = messagesContent.scrollHeight;
    }
});


window.onunload = function () {
    sessionStorage.clear();
}