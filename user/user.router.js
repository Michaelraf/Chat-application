const router = require('express').Router();
const userController = require('./user.controller');

router.post('/create', (req, res) => {
    userController.create(req, res);
});
router.post('/login', (req, res) => {
    console.log(req.body);
    userController.login(req, res);
});
router.put('/logout/:id', (req, res)=>{
    userController.logout(req, res);
});
router.get('/connectedUsers', (req, res)=>{
    userController.getAllConnectedUsers(req, res);
});
module.exports = router;