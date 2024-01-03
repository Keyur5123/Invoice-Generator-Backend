const BillService = require('../services/BillService');
const { resConst, logger } = require('../utilities/utility-functions');

module.exports = {
    saveNewInvoice: saveNewInvoice,
    updateInvoice: updateInvoice,
    updateInvoiceIsPaidStatus: updateInvoiceIsPaidStatus,
    deleteInvoice: deleteInvoice,
    getAllInvoiceDetails: getAllInvoiceDetails
}

function saveNewInvoice(req, res) {
    logger.info(`${resConst.ENTRY_LEVEL_LOG} - ${resConst.CONTROLLER} - saveNewInvoice`);
    BillService.saveNewInvoice(req, res)
        .then(data => {
            logger.info(`${resConst.SUCCESS_LEVEL_LOG} - ${resConst.CONTROLLER} - saveNewInvoice`);
            res.status(data.status).json({ data })
        })
        .catch(err => {
            logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.CONTROLLER} - saveNewInvoice`);
            res.status(err.status).json({ err })
        })
}

function updateInvoice(req, res) {
    logger.info(`${resConst.ENTRY_LEVEL_LOG} - ${resConst.CONTROLLER} - updateInvoice`);
    BillService.updateInvoice(req, res)
        .then(data => {
            logger.info(`${resConst.SUCCESS_LEVEL_LOG} - ${resConst.CONTROLLER} - updateInvoice`);
            res.status(data.status).json({ data })
        })
        .catch(err => {
            logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.CONTROLLER} - updateInvoice`);
            res.status(err.status).json({ err })
        })
}

function updateInvoiceIsPaidStatus(req, res) {
    logger.info(`${resConst.ENTRY_LEVEL_LOG} - ${resConst.CONTROLLER} - updateInvoiceIsPaidStatus`);
    BillService.updateInvoiceIsPaidStatus(req, res)
        .then(data => {
            logger.info(`${resConst.SUCCESS_LEVEL_LOG} - ${resConst.CONTROLLER} - updateInvoiceIsPaidStatus`);
            res.status(data.status).json({ data })
        })
        .catch(err => {
            logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.CONTROLLER} - updateInvoiceIsPaidStatus`);
            res.status(err.status).json({ err })
        })
}

function deleteInvoice(req, res) {
    logger.info(`${resConst.ENTRY_LEVEL_LOG} - ${resConst.CONTROLLER} - deleteInvoice`);
    BillService.deleteInvoice(req, res)
        .then(data => {
            logger.info(`${resConst.SUCCESS_LEVEL_LOG} - ${resConst.CONTROLLER} - deleteInvoice`);
            res.status(data.status).json({ data })
        })
        .catch(err => {
            logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.CONTROLLER} - deleteInvoice`);
            res.status(err.status).json({ err })
        })
}

function getAllInvoiceDetails(req, res) {
    logger.info(`${resConst.ENTRY_LEVEL_LOG} - ${resConst.CONTROLLER} - getAllInvoiceDetails`);
    BillService.getAllInvoiceDetails(req, res)
        .then(data => {
            logger.info(`${resConst.SUCCESS_LEVEL_LOG} - ${resConst.CONTROLLER} - getAllInvoiceDetails`);
            res.status(data.status).json({ data })
        })
        .catch(err => {
            logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.CONTROLLER} - getAllInvoiceDetails`);
            res.status(err.status).json({ err })
        })
}
