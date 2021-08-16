let messagesContainer = document.getElementById('messagesContainer');
let messages = document.getElementById('messages');
let form = document.getElementById('form');
let input = document.getElementById('input');

form.addEventListener('submit', function (e) {
    e.preventDefault();
    let msg = input.value;
    if (msg) {
        fetch("http://192.168.10.41:1337/message/create/" + sessionStorage.getItem('id'), {
            method: "POST",
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content : msg })
        })
            .then(res => res.json())
            .then((res) => {
                console.log(res);
                if (res.success === true) {
                    socket.emit('chat message', { message: msg, id: sessionStorage.getItem('id')});
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
    let item = document.createElement('li');
    if (userMsg.id === sessionStorage.getItem('id')) {
        item.classList.add('clientSide');
    }
    else {
        item.classList.add('nonClientSide');
    }
    item.textContent = userMsg.message;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

socket.on('newConnectedUser', function(data){
    
})