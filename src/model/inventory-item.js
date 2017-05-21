import mongoose from 'mongoose';
import CycleCountRequest from './cycle-count-request';
import PurchaseRequest from './purchase-request';
let Schema = mongoose.Schema;

let InventoryItemSchema = new Schema({
  inventoryID: {
    type: String,
    required: true
  },
  quantity: Number,
  binLocations: [String],
  cycleCountRequest: {
    type: Schema.Types.ObjectId,
    ref: 'CycleCountRequest',
  },
  purchaseRequest: {
    type: Schema.Types.ObjectId,
    ref: 'PurchaseRequest'
  }
});

module.exports = mongoose.model('InventoryItem', InventoryItemSchema); 