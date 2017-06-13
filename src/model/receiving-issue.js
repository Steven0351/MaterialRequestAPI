import mongoose from 'mongoose';
import User from './user';
import InventoryItem from './inventory-item';

let Schema = mongoose.Schema;

let ReceivingIssueSchema = new Schema({
  vendor: String,
  purchaseOrder: String,
  inventoryItems:[{type: Schema.Types.ObjectId, ref: 'InventoryItem'}],
  descriptionOfIssue: String,
  requestor: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  dateRequested: String
});

module.exports = mongoose.model('ReceivingIssue', ReceivingIssueSchema);