const products = require("../model/products");
const partyFerm = require("../model/partyFerm");
const { responseGenrator, logger, resConst } = require("../utilities/utility-functions");

module.exports = {
    addNewProduct: addNewProduct,
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

function addNewProduct(req, res) {
    logger.info(`${resConst.ENTRY_LEVEL_LOG} - ${resConst.SERVICE} - addNewProduct`);

    return new Promise(async (resolve, reject) => {
        try {
            let isProductExist = await products.find({ name: req.body.name });
            
            if (isProductExist.length > 0) {
                logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.SERVICE} - addNewProduct`);
                reject(responseGenrator(resConst.BAD_REQUEST, `${req.body.name.toUpperCase()} Product is already exist in database`, null, resConst.ERROR_MSG))
            }
            else {
                let newProduct = new products({
                    name: req.body.name,
                    rate: req.body.rate
                })

                newProduct.save()
                    .then(data => {
                        logger.info(`${resConst.SUCCESS_LEVEL_LOG} - ${resConst.SERVICE} - addNewProduct`);
                        resolve(responseGenrator(resConst.OK, null, data, resConst.OK_MSG))
                    }).catch(err => {
                        logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.SERVICE} - addNewProduct`);
                        reject(responseGenrator(resConst.BAD_REQUEST, err.toString(), null, resConst.ERROR_MSG));
                    });
            }
        } catch (error) {
            logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.SERVICE} - addNewProduct`);
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