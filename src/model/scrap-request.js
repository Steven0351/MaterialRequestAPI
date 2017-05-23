import mongoose from 'mongoose';
import User from './user';
import InventoryItem from './inventory-item';

let Schema = mongoose.Schema;

let ScrapRequestSchema = new Schema({
  itemsToScrap: [{type: Schema.Types.ObjectId, ref: 'InventoryItem'}],
  reason: String,
  requestor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dateRequested: String
});

module.exports = mongoose.model('ScrapRequest', ScrapRequestSchema);