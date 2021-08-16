let messagesContainer = document.getElementById('messagesContainer');
let messages = document.getElementById('messages');
let form = document.getElementById('form');
let input = document.getElementById('input');
let messagesContent = document.getElementById('messagesContent');

form.addEventListener('submit', function (e) {
    e.preventDefault();
    let msg = input.value;
    if (msg) {
        fetch("http://10.213.186.46:1337/message/create/" + sessionStorage.getItem('id'), {
            method: "POST",
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content: msg })
        })
            .then(res => res.json())
            .then((res) => {

                if (res.success === true) {
                    socket.emit('chat message', { message: msg, id: sessionStorage.getItem('id') });
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
    /* socket.emit('chat message', { message: input.value, id: sessionStorage.getItem('id')});
    input.value = ''; */
});

socket.on('chat message', function (userMsg) {
    if (userMsg.id != sessionStorage.getItem('id')) {
        let user = document.createElement('li');
        user.classList.add('sender');
        fetch('http://10.213.186.46:1337/user/' + userMsg.id, {
            method: "GET",
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then((res) => {
                user.textContent = res.data.username;
                user.classList.add('nonClientSide');
                let item = document.createElement('li');
                item.classList.add('nonClientSide');
                item.textContent = userMsg.message;
                messages.appendChild(user);
                messages.appendChild(item);
                messagesContent.scrollTop = messagesContent.scrollHeight;
            })
            .catch((err) => {
                console.log('err : ' + err);
            })
    }
    else {
        let item = document.createElement('li');
        item.classList.add('clientSide');
        item.textContent = userMsg.message;
        messages.appendChild(item);
        messagesContent.scrollTop = messagesContent.scrollHeight;
    }
});

socket.on('newConnectedUser', function (data) {

})