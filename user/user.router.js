const router = require('express').Router();
const userController = require('./user.controller');

router.post('/create', (req, res) => {
    userController.create(req, res);
});
router.get('/getUser/:id', (req, res)=>{
    userController.getUser(req, res);
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
router.get('/getSockets/:id', (req, res)=>{
    userController.getSocketsId(req, res);
});
router.put('/setSocket/:userId/:socketId', (req, res)=>{
    userController.setSocket(req, res);
});
router.put('/deleteSocket/:userId/:socketId' , (req, res)=>{
    userController.deleteSocket(req, res);
})
module.exports = router;