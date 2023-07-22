const ProductAndPartyService = require('../services/productAndPartyService');
const { resConst, logger } = require('../utilities/utility-functions');

module.exports = {
    addNewProduct: addNewProduct,
    addNewPartyFerm: addNewPartyFerm,
    getAllPartyFermAndProductsList: getAllPartyFermAndProductsList,
}

function getAllPartyFermAndProductsList(req, res) {
    logger.info(`${resConst.ENTRY_LEVEL_LOG} - ${resConst.CONTROLLER} - getAllPartyFermAndProductsList`);
    ProductAndPartyService.getAllPartyFermAndProductsList(req, res)
        .then(data => {
            logger.info(`${resConst.SUCCESS_LEVEL_LOG} - ${resConst.CONTROLLER} - getAllPartyFermAndProductsList`);
            res.status(data.status).json({ data })
        })
        .catch(err => {
            logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.CONTROLLER} - getAllPartyFermAndProductsList`);
            res.status(err.status).json({ err })
        })
}

function addNewProduct(req,res) {
    logger.info(`${resConst.ENTRY_LEVEL_LOG} - ${resConst.CONTROLLER} - addNewProduct`);
    ProductAndPartyService.addNewProduct(req, res)
        .then(data => {
            logger.info(`${resConst.SUCCESS_LEVEL_LOG} - ${resConst.CONTROLLER} - addNewProduct`);
            res.status(data.status).json({ data })
        })
        .catch(err => {
            logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.CONTROLLER} - addNewProduct`);
            res.status(err.status).json({ err })
        })
}

function addNewPartyFerm(req,res) {
    logger.info(`${resConst.ENTRY_LEVEL_LOG} - ${resConst.CONTROLLER} - addNewPartyFerm`);
    ProductAndPartyService.addNewPartyFerm(req, res)
        .then(data => {
            logger.info(`${resConst.SUCCESS_LEVEL_LOG} - ${resConst.CONTROLLER} - addNewPartyFerm`);
            res.status(data.status).json({ data })
        })
        .catch(err => {
            logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.CONTROLLER} - addNewPartyFerm`);
            res.status(err.status).json({ err })
        })
}