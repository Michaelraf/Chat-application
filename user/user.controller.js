let Users = require('./user.model');


const create = (req, res) => {
    let u = new Users(req.body);
    u.save().then(() => {
        res.json({
            success: true,
            message: "User created successfully"
        });
    }).catch((err) => {
        res.json({
            success: false,
            err
        });
    });
}

const getUser = (req, res) => {
    if (req.params.id) {
        Users.findOne({ _id: req.params.id }).then((data)=>{
            res.json({
                success: true,
                data
            });
        }).catch((err)=>{
            res.json({
                succces: false,
                err
            });
        });
    }
    else{
        res.json({
            success: false,
            message : "No given user_id"
        });
    }
}

const login = (req, res) => {
    Users.findOne({ username: req.body.username, password: req.body.password }).then((data) => {
        if (data) {
            data.updateOne({ connected: true }).then(() => { });
            res.json({
                success: true,
                message: "login successfuly",
                user_id: data._id
            });
        }
        else {
            res.json({
                success: false,
                message: "User not found"
            });
        }
    }).catch((err) => {
        res.json({
            success: false,
            err
        });
    });
};


const logout = (req, res) => {
    Users.findOne({ _id: req.params.id }).then((data) => {
        if (data) {
            data.updateOne({ connected: false }).then(() => { })
            res.json({
                success: true,
                message: "logout successfully"
            })
        }
    }).catch((err) => {
        res.json({
            success: false,
            err
        })
    });
}

const getAllConnectedUsers = (req, res) => {
    Users.find({connected: true}).then((data) => {
        res.json({
            success: true,
            data
        });
    }).catch((err) => {
        res.json({
            success: false,
            err
        });
    });
}

module.exports = {
    create,
    getUser,
    login,
    logout,
    getAllConnectedUsers
}