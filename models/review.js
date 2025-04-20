const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const reviewSchema = new Schema({
    comment : String,
    rating : {
        type: Number,
        min : 1,
        max : 5
    },
    createdAt : {
        type : Date,
        default: Date.now()  // If there is now date by default value will be the date of now when the review document is made 
    },
    author : {
        type : Schema.Types.ObjectId,
        ref : 'User',
    }
});

module.exports = mongoose.model("Review",reviewSchema); 