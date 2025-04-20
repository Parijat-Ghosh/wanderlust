const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
}); 

userSchema.plugin(passportLocalMongoose);
// passportLocalMongoose by defalut creates username,password in the schema 
// and does hashing,salting for us.

module.exports = mongoose.model('User', userSchema);
// This function creates a Mongoose model named 'User'using the schema userSchema.
