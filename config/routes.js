const express = require('express');
const router = express.Router();
const authController = require("../api/controllers/authController")

router.post('/register', authController.saveNewUser)
router.post('/login', authController.loginUser)

module.exports = router;