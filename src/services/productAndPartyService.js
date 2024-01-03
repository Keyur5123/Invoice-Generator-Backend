const products = require("../model/products");
const partyFerm = require("../model/partyFerm");
const { responseGenrator, logger, resConst } = require("../utilities/utility-functions");

module.exports = {
    getAllPartyFermAndProductsList: getAllPartyFermAndProductsList,
    upsertProductDetails: upsertProductDetails,
    upsertPartyFerm: upsertPartyFerm,
    deleteProduct: deleteProduct,
    deletePartyFerm: deletePartyFerm
}

function getAllPartyFermAndProductsList() {
    logger.info(`${resConst.ENTRY_LEVEL_LOG} - ${resConst.SERVICE} - getAllPartyFermAndProductsList`);

    return new Promise(async (resolve, reject) => {
        try {
            let [partyNameList, ProductsList] = await Promise.all(
                [
                    partyFerm.find().catch(err => {
                        logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.SERVICE} - getAllPartyFermAndProductsList`);
                        reject(responseGenrator(resConst.BAD_REQUEST, err, null, resConst.ERROR_MSG))
                    }),
                    products.find().catch(err => {
                        logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.SERVICE} - getAllPartyFermAndProductsList`);
                        reject(responseGenrator(resConst.BAD_REQUEST, err, null, resConst.ERROR_MSG))
                    })
                ]);

            let partyNameAndProductsList = {
                partyNameList: partyNameList,
                ProductsList: ProductsList
            }

            logger.info(`${resConst.SUCCESS_LEVEL_LOG} - ${resConst.SERVICE} - getAllPartyFermAndProductsList`);
            resolve(responseGenrator(resConst.OK, null, partyNameAndProductsList, resConst.OK_MSG));

        } catch (error) {
            logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.SERVICE} - getAllPartyFermAndProductsList`);
            reject(responseGenrator(resConst.BAD_REQUEST, error.toString() ?? error, null, resConst.ERROR_MSG));
        }
    })
}

function upsertProductDetails(req, res) {
    logger.info(`${resConst.ENTRY_LEVEL_LOG} - ${resConst.SERVICE} - upsertProductDetails`);

    return new Promise(async (resolve, reject) => {
        try {

            if (req?.body?.updateValue == true) {
                Promise.all(req?.body?.productDetails.map(async (product) => {
                    return await products.updateMany({ name: product.name }, { $set: { rate: product.rate } }, { upsert: true, new: true })
                }))
                    .then(res => {
                        logger.info(`${resConst.SUCCESS_LEVEL_LOG} - ${resConst.SERVICE} - upsertProductDetails`);
                        resolve(responseGenrator(resConst.OK, null, resConst.PRODUCTS_UPDATED_SUCCESSFUL, resConst.OK_MSG))
                    })
                    .catch(err => {
                        logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.SERVICE} - upsertProductDetails`);
                        reject(responseGenrator(resConst.BAD_REQUEST, err.toString(), null, resConst.ERROR_MSG));
                    });
            }
            else {
                let productName = req.body.productDetails?.name;
                let productRate = req.body.productDetails?.rate;
                let _id = req.body.productDetails?._id;

                let isProductExist = await products.find({ name: productName });

                if (_id) {
                    products.findOneAndUpdate({ _id: _id }, { $set: { name: productName, rate: productRate } }, { upsert: true, new: true })
                        .then(data => {
                            logger.info(`${resConst.SUCCESS_LEVEL_LOG} - ${resConst.SERVICE} - upsertProductDetails`);
                            resolve(responseGenrator(resConst.OK, null, resConst.PRODUCT_UPDATED_SUCCESSFUL, resConst.OK_MSG))
                        }).catch(err => {
                            logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.SERVICE} - upsertProductDetails`);
                            reject(responseGenrator(resConst.BAD_REQUEST, err.toString(), null, resConst.ERROR_MSG));
                        });
                }
                else if (isProductExist.length > 0) {
                    logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.SERVICE} - upsertProductDetails`);
                    reject(responseGenrator(resConst.BAD_REQUEST, `${productName.toUpperCase()} Product ${EXIST_IN_DATABASE}`, null, resConst.ERROR_MSG))
                }
                else {
                    let newProduct = new products({
                        name: productName,
                        rate: productRate
                    })

                    newProduct.save()
                        .then(data => {
                            logger.info(`${resConst.SUCCESS_LEVEL_LOG} - ${resConst.SERVICE} - upsertProductDetails`);
                            resolve(responseGenrator(resConst.OK, null, data, resConst.OK_MSG))
                        }).catch(err => {
                            logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.SERVICE} - upsertProductDetails`);
                            reject(responseGenrator(resConst.BAD_REQUEST, err.toString(), null, resConst.ERROR_MSG));
                        });
                }
            }
        } catch (error) {
            logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.SERVICE} - upsertProductDetails`);
            reject(responseGenrator(resConst.BAD_REQUEST, error.toString(), null, resConst.ERROR_MSG));
        }
    })
}

function upsertPartyFerm(req, res) {
    logger.info(`${resConst.ENTRY_LEVEL_LOG} - ${resConst.SERVICE} - upsertPartyFerm`);

    return new Promise(async (resolve, reject) => {
        try {
            let _id = req.body._id;
            if (_id) {
                partyFerm.findOneAndUpdate({ _id: _id }, { $set: { name: req.body.name, address: req.body.address, gstNo: req.body.gstNo } }, { new: true })
                    .then(data => {
                        logger.info(`${resConst.SUCCESS_LEVEL_LOG} - ${resConst.SERVICE} - upsertPartyFerm`);
                        resolve(responseGenrator(resConst.OK, null, resConst.PARTY_UPDATED_SUCCESSFUL, resConst.OK_MSG))
                    }).catch(err => {
                        logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.SERVICE} - upsertPartyFerm`);
                        reject(responseGenrator(resConst.BAD_REQUEST, err.toString(), null, resConst.ERROR_MSG));
                    });
            }
            else {
                let isPartyFermExist = await partyFerm.find({ name: req.body.name });

                if (isPartyFermExist.length > 0) {
                    logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.SERVICE} - upsertPartyFerm`);
                    reject(responseGenrator(resConst.BAD_REQUEST, `${req.body.name.toUpperCase()} Party Ferm ${EXIST_IN_DATABASE}`, null, resConst.ERROR_MSG))
                }
                else {
                    let newPartyFerm = new partyFerm({
                        name: req.body.name,
                        address: req.body.address,
                        gstNo: req.body.gstNo
                    })

                    newPartyFerm.save()
                        .then(data => {
                            logger.info(`${resConst.SUCCESS_LEVEL_LOG} - ${resConst.SERVICE} - upsertPartyFerm`);
                            resolve(responseGenrator(resConst.OK, null, data, resConst.OK_MSG))
                        }).catch(err => {
                            logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.SERVICE} - upsertPartyFerm`);
                            reject(responseGenrator(resConst.BAD_REQUEST, err.toString(), null, resConst.ERROR_MSG));
                        });
                }
            }
        } catch (error) {
            logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.SERVICE} - upsertPartyFerm`);
            reject(responseGenrator(resConst.BAD_REQUEST, error.toString(), null, resConst.ERROR_MSG));
        }
    })
}

function deleteProduct(req, res) {
    logger.info(`${resConst.ENTRY_LEVEL_LOG} - ${resConst.SERVICE} - deleteProduct`);

    return new Promise(async (resolve, reject) => {
        try {
            await products.findOneAndRemove({ _id: req.params.product_code })
                .then(data => {
                    if (data) {
                        logger.info(`${resConst.SUCCESS_LEVEL_LOG} - ${resConst.SERVICE} - deleteProduct`);
                        resolve(responseGenrator(resConst.OK, null, resConst.PRODUCT_DELETED_SUCCESSFUL, resConst.OK_MSG))
                    }
                    else {
                        logger.info(`${resConst.SUCCESS_LEVEL_LOG} - ${resConst.SERVICE} - deleteProduct`);
                        resolve(responseGenrator(resConst.OK, null, resConst.PRODUCT_NOT_FOUND, resConst.OK_MSG))
                    }
                });
        } catch (error) {
            logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.SERVICE} - deleteProduct`);
            reject(responseGenrator(resConst.BAD_REQUEST, error.toString(), null, resConst.ERROR_MSG));
        }
    })
}

function deletePartyFerm(req, res) {
    logger.info(`${resConst.ENTRY_LEVEL_LOG} - ${resConst.SERVICE} - deletePartyFerm`);

    return new Promise(async (resolve, reject) => {
        try {
            await partyFerm.findOneAndRemove({ _id: req.params.party_code })
                .then(data => {
                    if (data) {
                        logger.info(`${resConst.SUCCESS_LEVEL_LOG} - ${resConst.SERVICE} - deletePartyFerm`);
                        resolve(responseGenrator(resConst.OK, null, resConst.PARTY_DELETED_SUCCESSFUL, resConst.OK_MSG))
                    }
                    else {
                        logger.info(`${resConst.SUCCESS_LEVEL_LOG} - ${resConst.SERVICE} - deletePartyFerm`);
                        resolve(responseGenrator(resConst.OK, null, resConst.PARTY_NOT_FOUND, resConst.OK_MSG))
                    }
                });
        } catch (error) {
            logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.SERVICE} - deletePartyFerm`);
            reject(responseGenrator(resConst.BAD_REQUEST, error.toString(), null, resConst.ERROR_MSG));
        }
    })
}
