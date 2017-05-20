import mongoose from 'mongoose';
import User from './user';
let Schema = mongoose.Schema;

let MaterialIssueRequest = new Schema({
  invendtoryID: {
    type: String,
    required: true
  },
  workOrder: {
    type: String,
    required: true
  },
  requestor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('MaterialIssueRequest', MaterialIssueRequestSchema);
