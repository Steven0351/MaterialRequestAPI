import mongoose from 'mongoose';
import User from './user'
let Schema = mongoose.Schema;

let PurchaseRequestSchema = new Schema({
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
    },
    requestor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
});

module.exports = mongoose.model('PurchaseRequest', PurchaseRequestSchema);