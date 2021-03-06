import mongoose from 'mongoose';
import User from './user';
import PurchaseRequest from './purchase-request';
let Schema = mongoose.Schema;
let today = new Date();

let CreateMaterialRequestSchema = new Schema({
  manufacturerSKU: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  purchaseRequest: {
    type: Schema.Types.ObjectId,
    ref: 'PurchaseRequest'
  },
  requestor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dateRequested: String
});

module.exports = mongoose.model('CreateMaterialRequest', CreateMaterialRequestSchema);