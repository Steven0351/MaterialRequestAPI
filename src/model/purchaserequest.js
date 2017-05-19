import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let purchaseRequestSchema = new Schema({
    inventoryID: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    shippingMethod: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('PurchaseRequest', purchaseRequestSchema);