import mongoose from 'mongoose';
import User from './user';
let Schema = mongoose.Schema;

let BomRequestSchema = new Schema({

});

module.exports =  mongoose.model('BomRequest', BomRequestSchema);