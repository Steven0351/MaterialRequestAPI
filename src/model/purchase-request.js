import mongoose from 'mongoose';
import User from './user';
import InventoryItem from './inventory-item';
let Schema = mongoose.Schema;

let PurchaseRequestSchema = new Schema({
    itemsToBePurchased: [{type: Schema.Types.ObjectId, ref: 'InventoryItem'}],
    shippingMethod: String,
    isHot: Boolean,
    orderHasBeenPlaced: Boolean,
    orderAcknowledgementReceived: Boolean,
    trackingInformation: String,
    requestor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    dateRequested: String
});

module.exports = mongoose.model('PurchaseRequest', PurchaseRequestSchema);