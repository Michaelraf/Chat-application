let Messages = require('./message.model');

const create = (req, res) => {
    let m = new Messages(req.body);
    if (req.params.id) {
        m.user_id = req.params.id;
        m.save().then(() => {
            res.json({
                success: true,
                message: "message created successfully"
            });
        }).catch((err) => {
            res.json({
                success: false,
                err
            });
        });
    }
    else {
        res.json({
            success: false,
            message: "can't get user_id"
        })
    }

}

const getAllMessages = (req, res) => {
    Messages.find({}).populate('user_id', '-type').then((data)=>{
        res.json({
            success: true,
            data
        });
    }).catch((err)=>{
        res.json({
            success: false,
            err
        })
    })
}

module.exports = {
    create,
    getAllMessages
}