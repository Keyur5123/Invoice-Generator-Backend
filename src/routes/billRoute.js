const express = require('express');
const router = express.Router();
const Controller = require("../controllers/billController");
const { verifyUserToken } = require("../utilities/verifyUserToken");

router.post('/save/newInvoice/:user_code/v1', Controller.saveNewInvoice)
router.get('/check/allInvoices/:user_code/v1', verifyUserToken, Controller.getAllInvoiceDetails)

module.exports = router;