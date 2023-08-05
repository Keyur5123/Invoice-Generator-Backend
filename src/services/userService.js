const userData = require('../model/userData')
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const { responseGenrator, resConst, logger } = require('../utilities/utility-functions');

module.exports = {
    getAllUsers: getAllUsers,
    updateUserDetials: updateUserDetials,
}

function getAllUsers(req, res) {
    logger.info(`${resConst.ENTRY_LEVEL_LOG} - ${resConst.SERVICE} - getAllUsers`);

    return new Promise(async (resolve, reject) => {
        try {
            await userData.find({}).select({ 'password': 0 })
                .then(data => {
                    logger.info(`${resConst.SUCCESS_LEVEL_LOG} - ${resConst.SERVICE} - getAllUsers`);
                    resolve(responseGenrator(resConst.OK, null, data, resConst.SUCCESS_MSG));
                })
                .catch(err => {
                    logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.SERVICE} - getAllUsers`);
                    reject(responseGenrator(resConst.SERVER_ERROR, err.toString(), null, resConst.ERROR_MSG));
                });
        } catch (error) {
            logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.SERVICE} - getAllUsers`);
            reject(responseGenrator(resConst.SERVER_ERROR, error.toString(), null, resConst.ERROR_MSG));
        }
    })
}

function updateUserDetials(req, res) {
    logger.info(`${resConst.ENTRY_LEVEL_LOG} - ${resConst.SERVICE} - updateUserDetials`);

    return new Promise(async (resolve, reject) => {
        try {
            let is_admin = await userData.findOne({ _id: req.params.admin_code })
            if (is_admin) {
                await userData.findOneAndUpdate({ _id: req.body._id }, { $set: { user_name: req.body.user_name, email: req.body.email, roleId: req.body.roleId } }, { new: true })
                    .then(data => {
                        if (data) {
                            logger.info(`${resConst.SUCCESS_LEVEL_LOG} - ${resConst.SERVICE} - updateUserDetials`);
                            resolve(responseGenrator(resConst.OK, null, 'User details updated', resConst.SUCCESS_MSG));
                        } else {
                            logger.info(`${resConst.SUCCESS_LEVEL_LOG} - ${resConst.SERVICE} - updateUserDetials`);
                            resolve(responseGenrator(resConst.OK, null, 'User not found', resConst.SUCCESS_MSG));
                        }
                    })
                    .catch(err => {
                        logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.SERVICE} - updateUserDetials`);
                        reject(responseGenrator(resConst.SERVER_ERROR, err.toString(), null, resConst.ERROR_MSG));
                    });
            }
            else {
                logger.info(`${resConst.SUCCESS_LEVEL_LOG} - ${resConst.SERVICE} - updateUserDetials`);
                resolve(responseGenrator(resConst.OK, null, 'Unauthorized admin', resConst.SUCCESS_MSG));
            }
        } catch (error) {
            logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.SERVICE} - updateUserDetials`);
            reject(responseGenrator(resConst.SERVER_ERROR, error.toString(), null, resConst.ERROR_MSG));
        }
    })
}
