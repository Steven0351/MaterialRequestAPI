import mongoose from 'mongoose';
import User from './user';
import InventoryItem from './inventory-item';
let Schema = mongoose.Schema;

let CycleCountRequestSchema = new Schema({
  inventoryItems: [{type: Schema.Types.ObjectId, ref: 'InventoryItem'}],
  requestor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dateRequested: String
});

module.exports = mongoose.model('CycleCountRequest', CycleCountRequestSchema); 