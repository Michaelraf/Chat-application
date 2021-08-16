const router = require('express').Router();
const messageController = require('./message.controller');

router.post('/create/:id', (req, res)=>{
    messageController.create(req, res);
})


module.exports = router;