const jwt = require('jsonwebtoken');
const { logger, resConst, responseGenrator } = require("../utilities/utility-functions");

module.exports = {
    verifyUserToken: function (req, res, next) {
        try {
            let token = req?.headers?.authentication ? req.headers.authentication.split(' ')[1] : req.headers?.authorization?.split(' ')[1];

            jwt.verify(token, process.env.BCYPT_CREDENTIAL, (err, decode) => {
                if (err && !decode) {
                    logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.AUTHENTICATION} - verifyUserToken`);
                    let response = responseGenrator(resConst.NOT_AUTHORIZED, resConst.NOT_AUTHORIZED_USER, undefined, resConst.ERROR_MSG);
                    res.status(resConst.OK).json(response)
                }
                else {
                    req.obj = {
                        id: decode.id,
                        roleId: decode.roleId
                    }
                    logger.info(`${resConst.SUCCESS_LEVEL_LOG} - ${resConst.AUTHENTICATION} - verifyUserToken`);
                    next();
                }
            });
        } catch (error) {
            logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.AUTHENTICATION} - verifyUserToken`);
            let response = responseGenrator(resConst.NOT_AUTHORIZED, resConst.NOT_AUTHORIZED_USER, undefined, resConst.ERROR_MSG);
            res.status(resConst.OK).json(response)
        }
    }
}