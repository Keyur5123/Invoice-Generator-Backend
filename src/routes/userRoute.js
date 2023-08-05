const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const { verifyUserToken } = require("../utilities/verifyUserToken");

router.get('/check/allUsersList/:user_code/v1', verifyUserToken, userController.getAllUsers);
router.post('/update/userDetails/:admin_code/v1', verifyUserToken, userController.updateUserDetials);
router.get('/delete/userDetails/:user_code/v1', verifyUserToken, userController.deleteUserDetials);

module.exports = router;