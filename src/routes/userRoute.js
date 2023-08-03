const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");

router.get('/check/allUsersList/:user_code/v1', userController.getAllUsers);
router.get('/update/userRole/:admin_code/:user_code/:role_id/v1', userController.updateUserRole);

module.exports = router;