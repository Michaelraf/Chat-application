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

module.exports = {
    create
}