const userServices = require("../services/userService");
const { logger, resConst } = require("../utilities/utility-functions");

module.exports = {
    getAllUsers: getAllUsers,
    updateUserRole: updateUserRole
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

function updateUserRole(req, res) {
    logger.info(`${resConst.ENTRY_LEVEL_LOG} - ${resConst.CONTROLLER} - updateUserRole`);
    userServices.updateUserRole(req, res)
        .then(data => {
            logger.info(`${resConst.SUCCESS_LEVEL_LOG} - ${resConst.CONTROLLER} - updateUserRole`);
            res.status(data.status).send(data)
        })
        .catch(err => {
            logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.CONTROLLER} - updateUserRole`);
            res.status(err.status).send(err)
        })
}
