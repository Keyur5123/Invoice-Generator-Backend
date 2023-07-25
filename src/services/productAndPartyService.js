const products = require("../model/products");
const partyFerm = require("../model/partyFerm");
const { responseGenrator, logger, resConst } = require("../utilities/utility-functions");

module.exports = {
    upsertProductDetails: upsertProductDetails,
    addNewPartyFerm: addNewPartyFerm,
    getAllPartyFermAndProductsList: getAllPartyFermAndProductsList,
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
            reject(responseGenrator(resConst.BAD_REQUEST, error.toString(), null, resConst.ERROR_MSG));
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
                        let newAddedProducts = [];
                        let nonUpdatedProducts = [];
                        res.forEach(product => {
                            if (product.matchedCount == 1 && product.upsertedId == null) {
                                nonUpdatedProducts(product);
                            }
                            else if (product.matchedCount == 0 && product.upsertedId != null) {
                                newAddedProducts.push(product);
                            }
                        })
                        logger.info(`${resConst.SUCCESS_LEVEL_LOG} - ${resConst.SERVICE} - upsertProductDetails`);
                        resolve(responseGenrator(resConst.OK, null, { newAddedProducts, nonUpdatedProducts }, resConst.OK_MSG))
                    })
                    .catch(err => {
                        logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.SERVICE} - upsertProductDetails`);
                        reject(responseGenrator(resConst.BAD_REQUEST, err.toString(), null, resConst.ERROR_MSG));
                    });
            }
            else {
                let productName = req.body.productDetails?.name;
                let productRate = req.body.productDetails?.rate;

                let isProductExist = await products.find({ name: productName });

                if (isProductExist.length > 0) {
                    logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.SERVICE} - upsertProductDetails`);
                    reject(responseGenrator(resConst.BAD_REQUEST, `${productName.toUpperCase()} Product is already exist in database`, null, resConst.ERROR_MSG))
                }

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
        } catch (error) {
            logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.SERVICE} - upsertProductDetails`);
            reject(responseGenrator(resConst.BAD_REQUEST, error.toString(), null, resConst.ERROR_MSG));
        }
    })
}

function addNewPartyFerm(req, res) {
    logger.info(`${resConst.ENTRY_LEVEL_LOG} - ${resConst.SERVICE} - addNewPartyFerm`);

    return new Promise(async (resolve, reject) => {
        try {
            let isPartyFermExist = await partyFerm.find({ name: req.body.name });

            if (isPartyFermExist.length > 0) {
                logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.SERVICE} - addNewPartyFerm`);
                reject(responseGenrator(resConst.BAD_REQUEST, `${req.body.name.toUpperCase()} Party Ferm is already exist in database`, null, resConst.ERROR_MSG))
            }
            else {
                let newPartyFerm = new partyFerm({
                    name: req.body.name,
                    rate: req.body.rate
                })

                newPartyFerm.save()
                    .then(data => {
                        logger.info(`${resConst.SUCCESS_LEVEL_LOG} - ${resConst.SERVICE} - addNewPartyFerm`);
                        resolve(responseGenrator(resConst.OK, null, data, resConst.OK_MSG))
                    }).catch(err => {
                        logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.SERVICE} - addNewPartyFerm`);
                        reject(responseGenrator(resConst.BAD_REQUEST, err.toString(), null, resConst.ERROR_MSG));
                    });
            }
        } catch (error) {
            logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.SERVICE} - addNewPartyFerm`);
            reject(responseGenrator(resConst.BAD_REQUEST, error.toString(), null, resConst.ERROR_MSG));
        }
    })
}
