// RESTRUCTURING OUR REVIEW 

const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const {reviewSchema} = require("../schema.js");
const Review = require("../models/review.js"); // Review model
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js"); // Listing model // BECAUSE THE REVIEWS WILL BE ADDED TO THE LISTING MODEL ITSELF 
const {isLoggedIn, isReviewAuthor} = require("../middleware.js");


const reviewController = require("../controllers/reviews.js");

const validatereview= (req,res,next) => { // Middleware to validate the listing with reviewSchema
    let {error} = reviewSchema.validate(req.body); // this will check if the req.body can satisfy the reviewSchema that we have created with Joi 
    if(error){
        let errMsg = error.details.map(el => el.message).join(","); // If there is an error then extract the error message and join it with a comma
        throw new ExpressError(400,errMsg);
    }else{
        next(); // If there is no error then go to the next middleware
    }
}

// Review :-
// post review route :-
router.post("/",isLoggedIn,validatereview, wrapAsync(reviewController.post));

// Delete review route :-
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.delete));

module.exports = router;