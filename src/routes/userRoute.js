const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const { verifyUserToken } = require("../utilities/verifyUserToken");

router.get('/check/allUsersList/:user_code/v1', verifyUserToken, userController.getAllUsers);
router.post('/update/userRole/:admin_code/v1', verifyUserToken, userController.updateUserDetials);

module.exports = router;