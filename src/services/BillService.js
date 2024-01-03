const products = require("../model/products");
const BillItems = require("../model/billItems");
const allInvoices = require("../model/addNewInvoice");
const partyFerm = require("../model/partyFerm");
const { responseGenrator, logger, resConst } = require("../utilities/utility-functions");
const { getAllInvoiceDetailsPipeline } = require("../utilities/pipelines")
const mongoose = require("mongoose");

module.exports = {
    saveNewInvoice: saveNewInvoice,
    updateInvoice: updateInvoice,
    updateInvoiceIsPaidStatus: updateInvoiceIsPaidStatus,
    getAllInvoiceDetails: getAllInvoiceDetails,
    deleteInvoice: deleteInvoice
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
                    paymentEntryStatus: req.body.obj.paymentEntryStatus,
                    bill_no: req.body.obj.bill_no,
                    date_created: req.body.obj.date_created,
                    billItems: itemId,
                    discount: req.body.obj.discount,
                    igst: req.body.obj.igst,
                    sgst: req.body.obj.sgst,
                    cgst: req.body.obj.cgst,
                    tds: req.body.obj.tds,
                    billSubTotalAmount: req.body.obj.billSubTotalAmount,
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

function updateInvoice(req, res) {
    try {
        return new Promise(async (resolve, reject) => {
            let updated_obj = req?.body?.obj?._id;
            let product_details_update_alert;

            let _id = await allInvoices.findByIdAndUpdate(
                {
                    _id: updated_obj._id
                },
                {
                    $set: {
                        party_name: updated_obj.party_name,
                        address: updated_obj.address,
                        paymentEntryStatus: updated_obj.paymentEntryStatus,
                        bill_no: updated_obj.bill_no,
                        discount: updated_obj.discount,
                        igst: updated_obj.igst,
                        sgst: updated_obj.sgst,
                        cgst: updated_obj.cgst,
                        tds: updated_obj.tds,
                        billSubTotalAmount: updated_obj.billSubTotalAmount,
                        billTotalAmount: updated_obj.billTotalAmount,
                        date_created: updated_obj.date_created
                    }
                },
                { upsert: true, new: true }
            )
                .catch((err) => {
                    logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.SERVICE} - updateInvoice`);
                    reject(responseGenrator(resConst.BAD_REQUEST, err.toString(), null, resConst.ERROR_MSG))
                })

            let final_products = [];
            let updated_billItems = await Promise.all(req.body.obj.billItems.map(async (billItem) => {
                let productDetails = await products.find({ name: billItem.description });

                billItem["partyChNo"] = billItem.partyChNo;
                billItem["pcs"] = billItem.pcs;
                billItem["mtr"] = billItem.mtr;
                billItem["item_amount"] = billItem.item_amount;
                billItem["_id"] = billItem?._id;
                billItem["productsIds"] = productDetails[0]._id;

                if (productDetails[0].rate !== billItem.rate) {
                    let res = await updateProductPrice(productDetails[0], billItem);
                    product_details_update_alert = res.product_details_update_alert
                    final_products.push(res.prod_details)
                }

                final_products.push(productDetails[0])
                return billItem;
            }));

            let billItems = await BillItems.findByIdAndUpdate(
                {
                    _id: new mongoose.Types.ObjectId(updated_obj.billItemId)
                },
                {
                    $set: {
                        billItems: updated_billItems
                    }
                },
                { upsert: true, new: true }
            )
                .catch((err) => {
                    logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.SERVICE} - updateInvoice`);
                    reject(responseGenrator(resConst.BAD_REQUEST, err.toString(), null, resConst.ERROR_MSG))
                })

            logger.info(`${resConst.SUCCESS_LEVEL_LOG} - ${resConst.SERVICE} - updateInvoice`);
            resolve(responseGenrator(resConst.OK, null, { _id, billItems, products: final_products, msg: resConst.DETAILS_UPDATED_SUCCESSFUL, is_product_rate_updated: product_details_update_alert }, resConst.OK_MSG))

        })
    }
    catch (err) {
        logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.SERVICE} - updateInvoice`);
        reject(responseGenrator(resConst.BAD_REQUEST, err.toString(), null, resConst.ERROR_MSG))
    }
}


function updateInvoiceIsPaidStatus(req, res) {
    logger.info(`${resConst.ENTRY_LEVEL_LOG} - ${resConst.SERVICE} - updateInvoiceIsPaidStatus`);
    return new Promise(async (resolve, reject) => {
        try {
            Promise.all(req.body.invoiceArr.map(async (obj) => {
                return await allInvoices.findOneAndUpdate(
                    { _id: obj.invoice_id },
                    { $set: { is_paid: obj.is_paid } },
                    { upsert: true, new: true }
                )
            }))
                .then(res => {
                    getAllInvoiceDetails(req)
                        .then(AllInvoiceDetials => {
                            logger.info(`${resConst.SUCCESS_LEVEL_LOG} - ${resConst.SERVICE} - updateInvoiceIsPaidStatus`);
                            resolve(responseGenrator(resConst.OK, null, AllInvoiceDetials.data, resConst.OK_MSG))
                        })
                        .catch(err => {
                            logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.SERVICE} - updateInvoiceIsPaidStatus`);
                            reject(responseGenrator(resConst.BAD_REQUEST, err.toString() ?? err, null, resConst.ERROR_MSG))
                        });
                })
                .catch(err => {
                    logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.SERVICE} - updateInvoiceIsPaidStatus`);
                    reject(responseGenrator(resConst.BAD_REQUEST, err.toString() ?? err, null, resConst.ERROR_MSG))
                });


        } catch (error) {
            logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.SERVICE} - updateInvoiceIsPaidStatus`);
            reject(responseGenrator(resConst.BAD_REQUEST, error.toString() ?? error, null, resConst.ERROR_MSG))
        }
    })
}

function deleteInvoice(req, res) {
    logger.info(`${resConst.ENTRY_LEVEL_LOG} - ${resConst.SERVICE} - deleteInvoice`);
    return new Promise(async (resolve, reject) => {
        try {
            await allInvoices.findOneAndDelete({ _id: req.params.invoice_id })
                .catch(err => {
                    logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.SERVICE} - deleteInvoice`);
                    reject(responseGenrator(resConst.BAD_REQUEST, err.toString() ?? err, null, resConst.ERROR_MSG))
                })

            getAllInvoiceDetails(req)
                .then(remainingInvoices => {
                    logger.info(`${resConst.SUCCESS_LEVEL_LOG} - ${resConst.SERVICE} - deleteInvoice`);
                    resolve(responseGenrator(resConst.OK, null, remainingInvoices.data, resConst.OK_MSG))
                })
                .catch(err => {
                    logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.SERVICE} - deleteInvoice`);
                    reject(responseGenrator(resConst.BAD_REQUEST, err.toString() ?? err, null, resConst.ERROR_MSG))
                });
        } catch (error) {
            logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.SERVICE} - deleteInvoice`);
            reject(responseGenrator(resConst.BAD_REQUEST, error.toString() ?? error, null, resConst.ERROR_MSG))
        }
    })
}

function getAllInvoiceDetails(req, res) {
    logger.info(`${resConst.ENTRY_LEVEL_LOG} - ${resConst.SERVICE} - getAllInvoiceDetails`);
    return new Promise(async (resolve, reject) => {
        try {
            let roleId = req.params.roleId ? req.params.roleId : req.obj.roleId;

            if (roleId != '1') {
                getAllInvoiceDetailsPipeline.unshift({
                    $match: {
                        'user_code': new mongoose.Types.ObjectId(req.obj.id)
                    }
                })
            }

            await allInvoices.aggregate(getAllInvoiceDetailsPipeline)
                .then(invoice => {
                    let sortedInvoicesArr = invoice.sort((obj1,obj2) => {
                        return Number(new Date(obj2._id.date_created.split('-').reverse().join('-'))) - Number(new Date(obj1._id.date_created.split('-').reverse().join('-')));
                    })

                    logger.info(`${resConst.SUCCESS_LEVEL_LOG} - ${resConst.SERVICE} - getAllInvoiceDetails`);
                    resolve(responseGenrator(resConst.OK, null, sortedInvoicesArr, resConst.OK_MSG))
                })
                .catch(err => {
                    logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.SERVICE} - getAllInvoiceDetails`);
                    reject(responseGenrator(resConst.BAD_REQUEST, err.toString() ?? err, null, resConst.ERROR_MSG))
                });
        } catch (error) {
            logger.error(`${resConst.ERROR_LEVEL_LOG} - ${resConst.SERVICE} - getAllInvoiceDetails`);
            reject(responseGenrator(resConst.BAD_REQUEST, error.toString() ?? error, null, resConst.ERROR_MSG));
        }
    })
}

let updateProductPrice = async (oldObj, newObj) => {
    let product_data = await products.findOneAndUpdate({ name: oldObj.name }, { $set: { name: oldObj.name, rate: newObj.rate } }, { upsert: true, new: true })
        .then((data) => {
            return {
                product_details_update_alert: `Price Updated Successfully from ${oldObj.rate} to ${newObj.rate}...`,
                prod_details: data
            }
        })
        .catch(err => err.toString())

    return product_data;
}