import mongoose from 'mongoose';

let Schema = mongoose.Schema;

let User = new Schema({
    name: String,
    password: String
});