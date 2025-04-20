const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {  //   isAuthenticated() is a passport function which checks whether the user is loggedin or not
        // redirect url save 
        req.session.redirectUrl = req.originalUrl; // originalurl gives you the full original request URL, including the path and query string.
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}
// After making this middleware we will add it to our listing and review routes to implement authorization 

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}
// For authorization
module.exports.isOwner = async(req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(req.user && !listing.owner.equals(req.user._id)){
        req.flash("error","You don't have permission to do that!");
        return res.redirect(`/listings/${id}`); 
    }
    next(); 
}
module.exports.isReviewAuthor = async(req, res, next) => {
    let {reviewId,id} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash("error","You don't have permission to do that!");
        return res.redirect(`/listings/${id}`); 
    }
    next(); 
}

// const validatelisting = (req,res,next) => { // Middleware to validate the listing with listingSchema
// let {error} = listingSchema.validate(req.body); // this will check if the req.body can satisfy the listingSchema that we have created with Joi 
// if(error){
//     let errMsg = error.details.map(el => el.message).join(","); // If there is an error then extract the error message and join it with a comma
//     throw new ExpressError(400,errMsg);
// }else{
//     next(); // If there is no error then go to the next middleware
// }
// }

// const validatereview= (req,res,next) => { // Middleware to validate the listing with reviewSchema
// let {error} = reviewSchema.validate(req.body); // this will check if the req.body can satisfy the reviewSchema that we have created with Joi 
// if(error){
//     let errMsg = error.details.map(el => el.message).join(","); // If there is an error then extract the error message and join it with a comma
//     throw new ExpressError(400,errMsg);
// }else{
//     next(); // If there is no error then go to the next middleware
// }
// }

