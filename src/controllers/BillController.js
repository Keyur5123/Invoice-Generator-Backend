const BillService = require('../services/BillService');
const { responseGenrator, resConst, logger } = require('../utilities/utility-functions');

module.exports = {
    saveNewInvoice: saveNewInvoice,
    getAllInvoiceDetails: getAllInvoiceDetails,
    getAllPartyFermAndProductsList: getAllPartyFermAndProductsList
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

function getAllPartyFermAndProductsList(req, res) {
    logger.info(`${resConst.ENTRY_LEVEL_LOG} - ${resConst.CONTROLLER} - getAllPartyFermAndProductsList`);
    BillService.getAllPartyFermAndProductsList(req, res)
        .then(data => {
            logger.info(`${resConst.SUCCESS_LEVEL_LOG} - ${resConst.CONTROLLER} - getAllPartyFermAndProductsList`);
            res.status(data.status).json({ data })
        })
        .catch(err => {
            logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.CONTROLLER} - getAllPartyFermAndProductsList`);
            res.status(err.status).json({ err })
        })
}