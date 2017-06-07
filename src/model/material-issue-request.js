import mongoose from 'mongoose';
import User from './user';
let Schema = mongoose.Schema;

let MaterialIssueRequestSchema = new Schema({
  inventoryToBeIssued: [{type: Schema.Types.ObjectId, ref: 'InventoryItem'}],
  workOrder: {
    type: String,
    required: true
  },
  requestor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isComplete: Boolean,
  dateRequested: String
});

module.exports = mongoose.model('MaterialIssueRequest', MaterialIssueRequestSchema);
