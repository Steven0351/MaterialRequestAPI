import mongoose from 'mongoose';
import User from './user';
import InventoryItem from './inventory-item';

let Schema = mongoose.Schema;

let WorkOrderCompletionRequestSchema = new Schema({
  workOrdersToComplete: [String],
  requestor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dateRequested: String
});

module.exports = mongoose.model('WorkOrderCompletionRequest', WorkOrderCompletionRequestSchema);