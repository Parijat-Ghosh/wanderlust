// RESTRUCTURING OUR APP 

const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js"); // Listing model
const ExpressError = require("../utils/ExpressError.js");
const {isLoggedIn,isOwner} = require("../middleware.js");


const listingController = require("../controllers/listings.js");


const multer  = require('multer') // we will use multer to parse the data of enctype="multipart/form-data" form 
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage }) // this will store the files in the uploads(automatically created) folder
// now it will store the files in our storage file/ in cloud server 
// IT WILL BE STORED IN wanderlust_DEV folder in our cloudinary account **********************************





// WE ARE DELETING "/listings" from all the routes and making it only "/"
// because we have required the listings in app.js .....

const validatelisting = (req,res,next) => { // Middleware to validate the listing with listingSchema
    let {error} = listingSchema.validate(req.body); // this will check if the req.body can satisfy the listingSchema that we have created with Joi 
    if(error){
        let errMsg = error.details.map(el => el.message).join(","); // If there is an error then extract the error message and join it with a comma
        throw new ExpressError(400,errMsg);
    }else{
        next(); // If there is no error then go to the next middleware
    }
}



// Index route :- 
// To show all the data of the listing module / collection 
// router.get("/",wrapAsync(async (req,res) => {
//     const allListings = await Listing.find({});
//         res.render("./listings/index.ejs",{allListings}); // Express will seek for the views folder but the index.ejs file is situated 
//                                                          // in the listings folder which is situated under the views folder 
// }));

// router.route combines similar routes in one place so that we don't have to write the same route again and again
router
   .route("/")
   .get(wrapAsync(listingController.index)) // see the index route below
   .post(isLoggedIn,upload.single('listing[image]'),wrapAsync(listingController.post));// see the post route below 
   // validateListing in the above post request
//    .post(upload.single('listing[image]'),(req, res) => { // the image from listing[image] will be stored in req.file in uploads folder
//     res.send(req.file); // req.file object has the URL of the image (made by cloud) that we have uploaded in cloud ********************
//   })


//    .post((req,res) => {
//     res.send(req.body);  // output - {}  because our form data is "multipart/form-data" but express can only read urlencoded data 
//    }) // For this reason we will use npm multer package.

// New route :-
router.get("/new", isLoggedIn,wrapAsync(listingController.new)); // isLoggedIn from(middleware.js file) is passed as a middleware here 
// "/new" should be always above "/:id" because if it is below get request will treat "/new" as "/:id" and it will start searching for "/new"
//..in the database 

router
   .route("/:id")
   .get(wrapAsync(listingController.showListing))
   .put(isLoggedIn,isOwner,upload.single('listing[image]'),wrapAsync(listingController.update))
   .delete( isLoggedIn, isOwner,wrapAsync(listingController.delete));


//Index route :-
// router.get("/",wrapAsync(listingController.index));// when request is sent to "/" a function called index will be executed check "controllers/listings.js"
// we will use the index function from the listingcontroller 

// // New route :-
// router.get("/new", isLoggedIn,wrapAsync(listingController.new)); // isLoggedIn from(middleware.js file) is passed as a middleware here 

// Show route :-
// router.get("/:id", wrapAsync(listingController.showListing));

// Create route (After new route by the new route we will get the information and by the post route we will post it
// router.post("/",validatelisting,wrapAsync(listingController.post));

// Edit route :-
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.edit));

// Update route :-
// router.put("/:id", isLoggedIn,isOwner,validatelisting,wrapAsync(listingController.update));

// Delete listing route :-
// router.delete("/:id", isLoggedIn, isOwner,wrapAsync(listingController.delete));

module.exports = router;