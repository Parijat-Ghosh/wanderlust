if(process.env.NODE_ENV != "production"){ // When we will upload the web in github .env file shalln't be uploaded 
    require('dotenv').config(); 
}


// console.log(process.env.SECRET); // SECRET is one key in our .env file

const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const Listing = require("./models/listing.js"); // We have already exported listing.js so now it's time to require it as Listing
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate"); // To use <% layout("/layouts/boilerplate") %> as a shortcut to include boilerplate.ejs
// const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("./schema.js");
// const Review = require("./models/review.js");

//------------------------------------------------------------------------------------------------------------------------------------------------
const passport = require("passport"); // For authentication
const LocalStrategy = require("passport-local"); // For authentication
const User = require("./models/user.js"); // We have already exported user.js so now it's time to require it as User
//--------------------------------------------------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------------------------------------------------------
const listingRouter = require("./routes/listing.js");  // ****************************************************************
// app.use("/listings",listings); // *************************************************************** 37th line or so...
// where we will find the /listings route, we will use the "listings" constant defined by us

const reviewRouter = require("./routes/review.js"); // same for review as for listing
const userRouter = require("./routes/user.js");
//------------------------------------------------------------------------------------------------------------------------------------------------


const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");



app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true})); // This line is needed to make express understand  the urlencoded  
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,'public')));


const port = 8080;

// const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlast'; // This should remain outside the main() function for asynchronous execution

const dbUrl = process.env.ATLASDB_URL;

async function main(){
    await mongoose.connect(dbUrl);
}

main()
.then(() => {
    console.log("connection successful");
})
.catch(() => {
    console.log("Error occured!")
});


const validatereview= (req,res,next) => { // Middleware to validate the listing with reviewSchema
    let {error} = reviewSchema.validate(req.body); // this will check if the req.body can satisfy the reviewSchema that we have created with Joi 
    if(error){
        let errMsg = error.details.map(el => el.message).join(","); // If there is an error then extract the error message and join it with a comma
        throw new ExpressError(400,errMsg);
    }else{
        next(); // If there is no error then go to the next middleware
    }
}

const store = MongoStore.create({
    mongoUrl : dbUrl, // This is the url of our database
    crypto : {
        secret : process.env.SECRET
    },
    touchAfter : 24 * 3600  // If no interaction is done with the server then session info will update th 24 hours after the last interaction
});

store.on("error", () => {
    console.log("Error in mongo session store",error);
});

const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000, // Our session cookie will be expired in 7 days
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true
    },
};

app.use(session(sessionOptions));// Declaring sessions as a middleware

app.use(flash()); // we have to declare flash() before declaring our routes ("/listings","/listings/:id/reviews") because we will use it in routes 


// PASSPORT ALWAYS USE SESSIONS FOR MAKING USER AUTHENTICATION CONVENIENT 
// SO WE WILL WRITE THE PASSPORT MIDDLEWARE AFTER DEFINING THE SESSION MIDDLEWARE 
app.use(passport.initialize()); // Initializing passport for every request (USE ALWAYS)
app.use(passport.session()); // Initializing passport for every request(USE ALWAYS)
// passport.session() is important to make sure that the user is logged in on every request(for different pages of web) for a single session 

passport.use(new LocalStrategy(User.authenticate())); // For authentication
passport.serializeUser(User.serializeUser()); // To searialize/register the user in a session
passport.deserializeUser(User.deserializeUser()); // To desearialize/remove the user from a session


// local variables can be accessed in the ejs templates 
app.use((req,res,next) => { // Middleware to make the flash messages available to all our templates
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user; // we cannot directly access req.user in the ejs templates because it is a passport variable
    // .. so we are making a local variable currUser which stores req.user to access it in the ejs templates
    next(); 
});



// Making a demo user to check if authentication is working or not
// app.get("/demouser",async(req,res) => {
//     const fakeUser = new User({email : "9K9tD@example.com",username : "demoUser"});


// let registeredUser = await User.register(fakeUser,"password");//This registermethod is an inbuilt methodof passport-local-mongoose to register user
// res.send(registeredUser);

// });



app.use("/listings",listingRouter); // where we will find the "/listings" route, we will use the "listing" constant defined by us 
app.use("/listings/:id/reviews",reviewRouter); // where we will find the "/listings/:id/reviews" route, we will use the "reviews" constant 
// defined by us 
app.use("/",userRouter); // where we will find the "/" route, we will use the "user" constant defined by us


app.all("*",(req,res,next) => {
    next(new ExpressError(404,"Page Not Found!"));
});
app.use((err,req,res,next) => { // Our custom error handling middleware
    // if (res.headersSent) { 
    //     return next(err);  // Pass the error to the default Express handler
    // }
    let{statusCode = 500,message = 'Something Went Wrong'} = err;  // bydefault statusCode 500 bydefault message "Something Went Wrong"
    res.status(statusCode).render("error.ejs",{message});
    // res.status(statusCode).send(message);
});

app.listen(port,() => {
    console.log("Port is listening to the request!");
});



// app.get("/testListening",async(req,res) => {
//     let sampleListing = new Listing({
//         title : "My New Villa",
//         description : "By the beach",
//         price : 1500,
//         location : "Goa",
//         country : "India",
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });