const mongoose = require('mongoose');

//import schema class in mongoose
const Schema = mongoose.Schema;

//create schema for users 
const UserSchema = new Schema({
  name : {
    type  : String,
    required : true
  },
  email : {
    type : String,
    required : true
  },
  password : {
    type : String,
    required : true
  },
  avatar : {
    type : String
  },
  date : {
    type : Date,
    default : Date.now
  }
})


//Create a model of name User and pass it our schema which is defined above

module.exports = User = mongoose.model('users' , UserSchema);
