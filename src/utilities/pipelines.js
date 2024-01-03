module.exports.getAllInvoiceDetailsPipeline = [
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
                user_details: "$user_details",
                party_name: "$party_name",
                address: "$address",
                paymentEntryStatus: "$paymentEntryStatus",
                billItemId: "$billItems._id",
                bill_no: "$bill_no",
                discount: "$discount",
                igst: "$igst",
                sgst: "$sgst",
                cgst: "$cgst",
                tds: "$tds",
                is_paid: "$is_paid",
                billSubTotalAmount: "$billSubTotalAmount",
                billTotalAmount: "$billTotalAmount",
                date_created: "$date_created"
            },
            billItems: { $push: "$billItems.billItems" }
        }
    }
]
