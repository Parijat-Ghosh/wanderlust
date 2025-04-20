const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.post = (async(req,res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review); // The review object made in the show.ejs file has the data for new reviewdoc like review[rating],review[comment]

    console.log(newReview);
    
    newReview.author = req.user._id; // we are setting the author of the review to the user who is logged in

    listing.reviews.push(newReview); // we have created a review array in listing.js so we are pusing this newReview doc to the array 

     await newReview.save();
     await listing.save(); // because the listing is also changed having a new element in the review array
     req.flash("success","Successfully created a new review!");

     res.redirect(`/listings/${listing._id}`);

});

module.exports.delete = (async(req,res) => {
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews : reviewId}}); // Using $pull operator to delete the review from the reviews array 
    // ... of the listing object - It will match the id with the reviewId s in the reviews and will delete the review having the same id 
    await Review.findByIdAndDelete(reviewId); // To delete the review from the review array 
    req.flash("success","Successfully deleted the review!");
    res.redirect(`/listings/${id}`);

})