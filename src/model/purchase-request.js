import mongoose from 'mongoose';
import User from './user';
import InventoryItem from './inventory-item';
let Schema = mongoose.Schema;

let PurchaseRequestSchema = new Schema({
    itemsToBePurchased: [{type: Schema.Types.ObjectId, ref: 'InventoryItem'}],
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