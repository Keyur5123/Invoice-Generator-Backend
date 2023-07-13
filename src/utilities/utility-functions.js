const resConst = require("./constants/responseConstants");
const logger = require("./winston-logger");

module.exports = {

    resConst: resConst,
    logger: logger,

    responseGenrator: function (status, err, data, msg) {
        logger.info(`${resConst.ENTRY_LEVEL_LOG} - ${resConst.RESPONSE} - responseGenrator`);
        let resposeObject = {};
        resposeObject.status = status
        resposeObject.msg = msg
        err ? resposeObject.err = err : resposeObject.data = data
        
        logger.info(`${resConst.SUCCESS_LEVEL_LOG} - ${resConst.RESPONSE} - ${JSON.stringify(resposeObject)}`);
        return resposeObject
    }
}