const express = require('express');
const router = express.Router();
const Controller = require("../controllers/billController");
const { verifyUserToken } = require("../utilities/verifyUserToken");

router.post('/save/newInvoice/:user_code/v1', verifyUserToken, Controller.saveNewInvoice)
router.post('/update/invoice/:user_code/:invoice_id/v1', verifyUserToken, Controller.updateInvoice)
router.post('/update/invoice_paid_status/v1', verifyUserToken, Controller.updateInvoiceIsPaidStatus)
router.get('/check/allInvoices/:user_code/v1', verifyUserToken, Controller.getAllInvoiceDetails)
router.delete('/delete/deleteInvoice/:user_code/:roleId/:invoice_id/v1', verifyUserToken, Controller.deleteInvoice)

module.exports = router;