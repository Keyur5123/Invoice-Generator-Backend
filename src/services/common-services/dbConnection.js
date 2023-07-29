const mongoose = require("mongoose");
const { resConst, logger } = require('../../utilities/utility-functions');
require('dotenv').config();

logger.info(`${resConst.ENTRY_LEVEL_LOG} - ${resConst.DATABASE} - dbConnection`);

mongoose.connect(process.env.DB_URL)
    .then(() => {
        logger.info(`${resConst.SUCCESS_LEVEL_LOG} - ${resConst.DATABASE} - dbConnection`);
    })
    .catch((err) => {
        console.log("err ",err);
        logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.DATABASE} - dbConnection`);
    })
