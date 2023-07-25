const express = require('express');
const router = express.Router();
const Controller = require("../controllers/productAndPartyController");
const { verifyUserToken } = require("../utilities/verifyUserToken");

router.get('/check/all-products-and-partyFerms/:user_code/v1', verifyUserToken, Controller.getAllPartyFermAndProductsList)
router.post('/upsert/product-list/:user_code/v1', verifyUserToken, Controller.upsertProductDetails)
router.post('/save/add-new-partyFerm/:user_code/v1', verifyUserToken, Controller.addNewPartyFerm)

module.exports = router;