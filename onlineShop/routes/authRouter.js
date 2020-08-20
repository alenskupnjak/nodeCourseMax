const express = require('express'); // setup za router
const authController = require('../controllers/authCtrl')

const router = express.Router(); // setup za router

//////////////////////////////////////////////////////////
// PATH /

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.post('/logout', authController.postLogout);

module.exports = router; // setup za router