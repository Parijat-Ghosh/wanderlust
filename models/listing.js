const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

// Defining Schema for the listing Model 
const ListingSchema = new Schema({
    title :{ // "S" is uppercase ofcourse 
        type : String,
        required : true
    }, 
    description : String,
    // image : {  // default - if no image is there , set - if image is there but the link of the image is undefined or broken 
        
    //     type : String,
    //     default : "https://plus.unsplash.com/premium_photo-1664476330720-c295de45f928?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" ,
    //     set : (v) => v === "" ? "https://plus.unsplash.com/premium_photo-1664476330720-c295de45f928?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
    //     : v, // v is a temporary variable which is storing the image link 
    // },

    image : {
        url : String,
        filename : String,
    },
    price : Number,
    location : String,
    country : String,
    reviews : [{
        type : Schema.Types.ObjectId,
        ref : 'Review' // The objectId will come from the Review model 
    }],
    owner : {  // owner in added in listingSchema in listing.js in models
        type : Schema.Types.ObjectId,
        ref : 'User' // The objectId will come from the User model
    },
    geometry : {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
    //   catagory : {
    //     type : String,
    //     enum : ['Lake','Forest','Beach','Luxury','Boat'], 
    //   }
});

// We want to delete the reviews associated with the listings if the listing itself is deleted 
ListingSchema.post('findOneAndDelete', async(listing) => {
    if(listing) { // If a listing comes with 'findOneAndDelete' then it will delete those reviews which matches with listing.reviews 
        await Review.deleteMany({_id : {$in : listing.reviews}});

    };
});
// Making new "Listing" model in mongoose
const Listing = mongoose.model("Listing",ListingSchema);


module.exports = Listing; // Exporting our Listing model to app.js 