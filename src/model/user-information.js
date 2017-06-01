import mongoose from 'mongoose';
import User from './user';
let Schema = mongoose.Schema;

let UserInformationSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('UserInformation', UserInformationSchema);