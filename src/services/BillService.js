const products = require("../model/products");
const BillItems = require("../model/billItems");
const allInvoices = require("../model/addNewInvoice");
const partyFerm = require("../model/partyFerm");
const { responseGenrator, logger, resConst } = require("../utilities/utility-functions");
const mongoose = require("mongoose");

module.exports = {
    saveNewInvoice: saveNewInvoice,
    getAllInvoiceDetails: getAllInvoiceDetails
}

function saveNewInvoice(req, res) {
    logger.info(`${resConst.ENTRY_LEVEL_LOG} - ${resConst.SERVICE} - saveNewInvoice`);
    return new Promise(async (resolve, reject) => {
        new Promise(async (resolve, reject) => {
            let billItems = await Promise.all(req.body.obj.billItems.map(async (billItem) => {
                let productId = await products.find({ name: billItem.description });
                if (productId.length == 0) {
                    let addProduct = new products({
                        name: billItem.description,
                        rate: billItem.rate
                    })
                    let recentlyAddedProd = await addProduct.save()
                    productId = [recentlyAddedProd]
                }

                billItem['productsIds'] = productId[0]._id
                return billItem
            }))

            if (billItems) {
                logger.info(`${resConst.SUCCESS_LEVEL_LOG} - ${resConst.SERVICE} - saveNewInvoice`);
                resolve(billItems)
            }
            else {
                logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.SERVICE} - saveNewInvoice`);
                reject(responseGenrator(resConst.BAD_REQUEST, resConst.ERROR_OCCURE_WHILE_ADDING_INVOICE, null, resConst.ERROR_MSG))
            }
        })
            .then(async (billItems) => {
                let newbillItem = new BillItems({
                    billItems
                })

                let billItemId = await newbillItem.save();
                if (billItemId) {
                    return billItemId._id
                }
                else {
                    logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.SERVICE} - saveNewInvoice`);
                    reject(responseGenrator(resConst.BAD_REQUEST, resConst.BILL_NOT_FOUND, null, resConst.ERROR_MSG))
                }
            })
            .then(async (billItemId) => {
                let itemId = await billItemId;

                let newInvoice = allInvoices({
                    party_name: req.body.obj.party_name,
                    address: req.body.obj.address,
                    bill_no: req.body.obj.bill_no,
                    date_created: req.body.obj.date_created,
                    billItems: itemId,
                    discount: req.body.obj.discount,
                    igst: req.body.obj.igst,
                    sgst: req.body.obj.sgst,
                    cgst: req.body.obj.cgst,
                    tds: req.body.obj.tds,
                    billTotalAmount: req.body.obj.billTotalAmount,
                    user_code: req.params.user_code
                })

                let addInvoice = await newInvoice.save();
                if (addInvoice) {
                    logger.info(`${resConst.SUCCESS_LEVEL_LOG} - ${resConst.SERVICE} - saveNewInvoice`);
                    resolve(responseGenrator(resConst.OK, null, addInvoice._id, resConst.OK_MSG))
                }
                else {
                    logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.SERVICE} - saveNewInvoice`);
                    reject(responseGenrator(resConst.BAD_REQUEST, resConst.INVOICE_IS_NOT_SAVED, null, resConst.ERROR_MSG))
                }
            })
            .catch(err => {
                logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.SERVICE} - saveNewInvoice`);
                reject(responseGenrator(resConst.BAD_REQUEST, err._message, null, resConst.ERROR_MSG))
            });
    })
}

function getAllInvoiceDetails(req, res) {
    logger.info(`${resConst.ENTRY_LEVEL_LOG} - ${resConst.SERVICE} - getAllInvoiceDetails`);
    return new Promise(async (resolve, reject) => {
        try {
            let pipeline = [
                {
                    $lookup: {
                        from: "billitems",
                        localField: "billItems",
                        foreignField: "_id",
                        as: "billItems"
                    }
                },
                {
                    $unwind: {
                        path: "$billItems",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $unwind: {
                        path: "$billItems.billItems",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "products",
                        localField: "billItems.billItems.productsIds",
                        foreignField: "_id",
                        as: "billItems.billItems.products"
                    }
                },
                {
                    $unwind: {
                        path: "$products",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "userdatas",
                        localField: "user_code",
                        foreignField: "_id",
                        as: "user_details"
                    }
                },
                {
                    $unwind: {
                        path: "$user_details",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $unset: "user_details.password"
                },
                {
                    $group: {
                        _id: {
                            _id: "$_id",
                            user_details: "user_details",
                            party_name: "$party_name",
                            address: "$address",
                            bill_no: "$bill_no",
                            discount: "$discount",
                            igst: "$igst",
                            sgst: "$sgst",
                            cgst: "$cgst",
                            tds: "$tds",
                            billTotalAmount: "$billTotalAmount",
                            date_created: "$date_created"
                        },
                        billItems: { $push: "$billItems.billItems" }
                    }
                }
            ]

            if (req.obj.roleId != '1') {
                pipeline.unshift({
                    $match: {
                        'user_code': new mongoose.Types.ObjectId(req.obj.id)
                    }
                })
            }

            await allInvoices.aggregate(pipeline)
                .then(invoice => {
                    logger.info(`${resConst.SUCCESS_LEVEL_LOG} - ${resConst.SERVICE} - getAllInvoiceDetails`);
                    resolve(responseGenrator(resConst.OK, null, invoice, resConst.OK_MSG))
                })
                .catch(err => {
                    logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.SERVICE} - getAllInvoiceDetails`);
                    reject(responseGenrator(resConst.BAD_REQUEST, err, null, resConst.ERROR_MSG))
                });
        } catch (error) {
            logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.SERVICE} - getAllInvoiceDetails`);
            reject(responseGenrator(resConst.BAD_REQUEST, error.toString(), null, resConst.ERROR_MSG));
        }
    })
}