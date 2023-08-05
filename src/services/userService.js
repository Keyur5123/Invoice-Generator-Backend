const userData = require('../model/userData')
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const { responseGenrator, resConst, logger } = require('../utilities/utility-functions');

module.exports = {
    getAllUsers: getAllUsers,
    updateUserDetials: updateUserDetials,
    deleteUserDetials: deleteUserDetials,
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
                            resolve(responseGenrator(resConst.OK, null, resConst.USER_DETAILS_UPDATED, resConst.SUCCESS_MSG));
                        } else {
                            logger.info(`${resConst.SUCCESS_LEVEL_LOG} - ${resConst.SERVICE} - updateUserDetials`);
                            resolve(responseGenrator(resConst.OK, null, resConst.USER_NOT_FOUND, resConst.SUCCESS_MSG));
                        }
                    })
                    .catch(err => {
                        logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.SERVICE} - updateUserDetials`);
                        reject(responseGenrator(resConst.SERVER_ERROR, err.toString(), null, resConst.ERROR_MSG));
                    });
            }
            else {
                logger.info(`${resConst.SUCCESS_LEVEL_LOG} - ${resConst.SERVICE} - updateUserDetials`);
                resolve(responseGenrator(resConst.OK, null, resConst.ADMIN_UNAUTHORIZED, resConst.SUCCESS_MSG));
            }
        } catch (error) {
            logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.SERVICE} - updateUserDetials`);
            reject(responseGenrator(resConst.SERVER_ERROR, error.toString(), null, resConst.ERROR_MSG));
        }
    })
}

function deleteUserDetials(req, res) {
    logger.info(`${resConst.ENTRY_LEVEL_LOG} - ${resConst.SERVICE} - deleteUserDetials`);

    return new Promise(async (resolve, reject) => {
        try {
            await userData.findOneAndRemove({ _id: req.params.user_code })
                .then(data => {
                    if (data) {
                        logger.info(`${resConst.SUCCESS_LEVEL_LOG} - ${resConst.SERVICE} - deleteProduct`);
                        resolve(responseGenrator(resConst.OK, null, resConst.USER_DELETED_SUCCESSFULLY, resConst.OK_MSG))
                    }
                    else {
                        logger.info(`${resConst.SUCCESS_LEVEL_LOG} - ${resConst.SERVICE} - deleteProduct`);
                        resolve(responseGenrator(resConst.OK, null, resConst.USER_NOT_FOUND, resConst.OK_MSG))
                    }
                });
        } catch (error) {
            logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.SERVICE} - deleteUserDetials`);
            reject(responseGenrator(resConst.SERVER_ERROR, error.toString(), null, resConst.ERROR_MSG));
        }
    })
}
