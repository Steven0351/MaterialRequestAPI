import mongoose from 'mongoose';
import User from './user';
import CountRequest from './count-request';
let Schema = mongoose.Schema;

let CycleCountRequestSchema = new Schema({
  countRequests: [{type: Schema.Types.ObjectId, ref: 'CountRequest'}],
  requestor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('CycleCountRequest', CycleCountRequestSchema); 