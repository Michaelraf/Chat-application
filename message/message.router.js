const router = require('express').Router();
const messageController = require('./message.controller');

router.post('/create/:id', (req, res)=>{
    messageController.create(req, res);
})
router.get('/getAll', (req, res)=>{
    messageController.getAllMessages(req, res);
})

module.exports = router;