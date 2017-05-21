import mongoose from 'mongoose';
import User from './user';
let Schema = mongoose.Schema;

let BomRequestSchema = new Schema({
  proposedTopLevelID: {
    type: String,
    required: true
  },
  subcomponents: {String : Number},
  requestor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports =  mongoose.model('BomRequest', BomRequestSchema);