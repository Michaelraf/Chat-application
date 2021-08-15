const router = require('express').Router();
const userController = require('./user.controller');

router.post('/create', (req, res) => {
    userController.create(req, res);
});
router.post('/login', (req, res) => {
    console.log(req.body);
});

module.exports = router;