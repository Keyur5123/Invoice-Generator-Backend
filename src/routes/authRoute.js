const express = require('express');
const router = express.Router();
const authController = require("../controllers/authController");

router.post('/register/addUser/v1', authController.saveNewUser);
router.post('/login/checkUser/v1', authController.loginUser);

module.exports = router;