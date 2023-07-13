const authServices = require("../services/authService");
const { logger, resConst } = require("../utilities/utility-functions");

module.exports = {
    saveNewUser: saveNewUser,
    loginUser: loginUser
}

function saveNewUser(req, res) {
    logger.info(`${resConst.ENTRY_LEVEL_LOG} - ${resConst.CONTROLLER} - saveNewUser`);
    authServices.saveNewUser(req, res)
        .then(data => {
            logger.info(`${resConst.SUCCESS_LEVEL_LOG} - ${resConst.CONTROLLER} - saveNewUser`);
            res.status(data.status).send(data)
        })
        .catch(err => {
            logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.CONTROLLER} - saveNewUser`);
            res.status(err.status).send(err)
        })
}

function loginUser(req, res) {
    logger.info(`${resConst.ENTRY_LEVEL_LOG} - ${resConst.CONTROLLER} - loginUser`);
    authServices.loginUser(req, res)
        .then(data => {
            logger.info(`${resConst.SUCCESS_LEVEL_LOG} - ${resConst.CONTROLLER} - loginUser`);
            res.status(data.status).send(data)
        })
        .catch(err => {
            logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.CONTROLLER} - loginUser`);                                                                                                                  
            res.status(err.status).send(err)
        })
}