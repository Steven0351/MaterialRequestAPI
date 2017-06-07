import mongoose from 'mongoose';
import BomRequest from './bom-request';
import CycleCountRequest from './cycle-count-request';
import PurchaseRequest from './purchase-request';
import MaterialIssueRequest from './material-issue-request'
import ReceivingIssue from './receiving-issue';
let Schema = mongoose.Schema;

let InventoryItemSchema = new Schema({
  inventoryID: String,
  quantity: Number,
  binLocations: [String],
  cycleCountRequest: {
    type: Schema.Types.ObjectId,
    ref: 'CycleCountRequest',
  },
  materialIssueRequest: {
    type: Schema.Types.ObjectId,
    ref: 'MaterialIssueRequest'
  },
  bomRequest: {
    type: Schema.Types.ObjectId,
    ref: 'BomRequest'
  },
  purchaseRequest: {
    type: Schema.Types.ObjectId,
    ref: 'PurchaseRequest'
  },
  adjustmentRequest: {
    type: Schema.Types.ObjectId,
    ref: 'AdjustmentRequest'
  },
  receivingIssue: {
    type: Schema.Types.ObjectId,
    ref: 'ReceivingIssue'
  }
});

module.exports = mongoose.model('InventoryItem', InventoryItemSchema); 