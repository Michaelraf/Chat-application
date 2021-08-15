let Users = require('./user.model');


const create = (req, res) => {
    let u = new Users(req.body);
    u.save().then(() => {
        res.json({ success: true });
    })
}

function login(auth) {
    return new Promise((resolve, reject) => {
        Users.findOne({ username: auth.username, password: auth.password }).then((data) => {
            if (data) {
                data.updateOne({ connected: true }).then(() => { });
            }
            resolve(data);
        }).catch((err) => {
            reject({ err })
        })
    })
};

const loggedIn = (ids) => {
    Users.findOne({ _id: ids.userId }).then((data) => {
        if (data) {
            data.updateOne({ $push : { sockets  : ids.socketId }}).then(() => { });
        }
    });
}

const logout = (ids) => {
    Users.findOne({ _id: ids.userId }).then((data) => {
        if (data) {
            console.log(data);
            data.updateOne({ $pull : { sockets: { $in : [ids.socketId] } } }).then(() => {});
            if(data.sockets.length == 0 ){
                data.updateOne({connected : false}).then(()=>{});
            }
        }
    });
}

const getAllConnectedUsers = ()=>{
    return new Promise((resolve, reject)=>{
        Users.find({connected: true}).then((data)=> {
            resolve(data);
        }).catch((err)=>{
            reject(err);
        });
    });
}

module.exports = {
    create,
    login,
    loggedIn,
    logout,
    getAllConnectedUsers
}