import mongoose from 'mongoose';
import User from './user';
import InventoryItem from './inventory-item';
let Schema = mongoose.Schema;

// TODO - Figure out how to utilize storage and CRUD attachments for attached GDT-MFG PO's and Customer PO's
let PurchaseRequestSchema = new Schema({
    inventoryItems: [{type: Schema.Types.ObjectId, ref: 'InventoryItem'}],
    shippingMethod: String,
    hot: Boolean,
    dropShip: Boolean,
    approved: Boolean,
    placed: Boolean,
    acknowledgementReceived: Boolean,
    purchaseOrderNumber: String,
    vendor: String,
    trackingInformation: String,
    requestor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    dateRequested: String
});

module.exports = mongoose.model('PurchaseRequest', PurchaseRequestSchema);