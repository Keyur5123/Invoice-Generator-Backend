const ProductAndPartyService = require('../services/productAndPartyService');
const { resConst, logger } = require('../utilities/utility-functions');

module.exports = {
    getAllPartyFermAndProductsList: getAllPartyFermAndProductsList,
    upsertProductDetails: upsertProductDetails,
    addNewPartyFerm: addNewPartyFerm,
    deleteProduct: deleteProduct,
    deletePartyFerm: deletePartyFerm
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

function upsertProductDetails(req,res) {
    logger.info(`${resConst.ENTRY_LEVEL_LOG} - ${resConst.CONTROLLER} - upsertProductDetails`);
    ProductAndPartyService.upsertProductDetails(req, res)
        .then(data => {
            logger.info(`${resConst.SUCCESS_LEVEL_LOG} - ${resConst.CONTROLLER} - upsertProductDetails`);
            res.status(data.status).json({ data })
        })
        .catch(err => {
            logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.CONTROLLER} - upsertProductDetails`);
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

function deleteProduct(req,res) {
    logger.info(`${resConst.ENTRY_LEVEL_LOG} - ${resConst.CONTROLLER} - deleteProduct`);
    ProductAndPartyService.deleteProduct(req, res)
        .then(data => {
            logger.info(`${resConst.SUCCESS_LEVEL_LOG} - ${resConst.CONTROLLER} - deleteProduct`);
            res.status(data.status).json({ data })
        })
        .catch(err => {
            logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.CONTROLLER} - deleteProduct`);
            res.status(err.status).json({ err })
        })
}

function deletePartyFerm(req,res) {
    logger.info(`${resConst.ENTRY_LEVEL_LOG} - ${resConst.CONTROLLER} - deletePartyFerm`);
    ProductAndPartyService.deletePartyFerm(req, res)
        .then(data => {
            logger.info(`${resConst.SUCCESS_LEVEL_LOG} - ${resConst.CONTROLLER} - deletePartyFerm`);
            res.status(data.status).json({ data })
        })
        .catch(err => {
            logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.CONTROLLER} - deletePartyFerm`);
            res.status(err.status).json({ err })
        })
}