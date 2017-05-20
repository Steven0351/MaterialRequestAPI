import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
let Schema = mongoose.Schema;

let User = new Schema({
  username: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

User.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', User);