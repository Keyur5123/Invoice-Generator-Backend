const express = require('express');
const router = express.Router();
const Controller = require("../controllers/BillController");
const { verifyUserToken } = require("../utilities/verifyUserToken");

router.post('/save/newInvoice/:user_code/v1', Controller.saveNewInvoice)
router.get('/check/allInvoices/:user_code/v1', verifyUserToken, Controller.getAllInvoiceDetails)
router.get('/check/allPartyFerm/:user_code/v1', verifyUserToken, Controller.getAllPartyFermList)

module.exports = router;