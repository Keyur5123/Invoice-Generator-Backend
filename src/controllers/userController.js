const userServices = require("../services/userService");
const { logger, resConst } = require("../utilities/utility-functions");

module.exports = {
    getAllUsers: getAllUsers,
    updateUserDetials: updateUserDetials,
    deleteUserDetials: deleteUserDetials,
}

function getAllUsers(req, res) {
    logger.info(`${resConst.ENTRY_LEVEL_LOG} - ${resConst.CONTROLLER} - getAllUsers`);
    userServices.getAllUsers(req, res)
        .then(data => {
            logger.info(`${resConst.SUCCESS_LEVEL_LOG} - ${resConst.CONTROLLER} - getAllUsers`);
            res.status(data.status).send(data)
        })
        .catch(err => {
            logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.CONTROLLER} - getAllUsers`);
            res.status(err.status).send(err)
        })
}

function updateUserDetials(req, res) {
    logger.info(`${resConst.ENTRY_LEVEL_LOG} - ${resConst.CONTROLLER} - updateUserDetials`);
    userServices.updateUserDetials(req, res)
        .then(data => {
            logger.info(`${resConst.SUCCESS_LEVEL_LOG} - ${resConst.CONTROLLER} - updateUserDetials`);
            res.status(data.status).send(data)
        })
        .catch(err => {
            logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.CONTROLLER} - updateUserDetials`);
            res.status(err.status).send(err)
        })
}

function deleteUserDetials(req, res) {
    logger.info(`${resConst.ENTRY_LEVEL_LOG} - ${resConst.CONTROLLER} - deleteUserDetials`);
    userServices.deleteUserDetials(req, res)
        .then(data => {
            logger.info(`${resConst.SUCCESS_LEVEL_LOG} - ${resConst.CONTROLLER} - deleteUserDetials`);
            res.status(data.status).send(data)
        })
        .catch(err => {
            logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.CONTROLLER} - deleteUserDetials`);
            res.status(err.status).send(err)
        })
}
