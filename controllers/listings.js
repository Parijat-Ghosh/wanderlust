const Listing = require("../models/listing");
const maptilerClient = require('@maptiler/client');

maptilerClient.config.apiKey = 's72amowdGowKmTxIwPsw';

// FOR   "MVC FRAMEWORK"    (MODEL VIEW CONTROLLER) where CONTROLLER has all the routing logic...
//(MVC -  model,view,routing)

module.exports.index = async(req, res) => {
        const allListings = await Listing.find({});
            res.render("./listings/index.ejs",{allListings}); // Express will seek for the views folder but the index.ejs file is situated 
                                                             // in the listings folder which is situated under the views folder 
};

module.exports.new = async(req, res) => {
    res.render("./listings/new.ejs");
 };

module.exports.showListing = async(req, res) => {
    let {id} = req.params;
        const listing = await Listing.findById(id).populate({path : "reviews", populate : {path : "author"}}).populate("owner");
         // We have already assigned the review objetb in the listing model 
        // ... so by using populate we are basically sending the whole data of reviews, not only the object id .
        if(!listing){
            req.flash("error","Cannot find that listing!");
            res.redirect("/listings");
        }
        console.log(listing);
        res.render("./listings/show.ejs",{listing});
}

module.exports.post = (async(req,res,next)=> {
    const location =req.body.listing.location;
    const response = await maptilerClient.geocoding.forward(location, {
        limit:1, 
    })
    // console.log(response);
    // res.send("done");
    
    // Extract the coordinates from the first feature in the response
    // const coordinates = response.features[0].geometry.coordinates;

    // Extract longitude and latitude
    // const [longitude, latitude] = coordinates;  // coordinates: [77.2090, 28.6139],

    // Print the coordinates
    // console.log('Longitude:', longitude);
    // console.log('Latitude:', latitude);




    let url = req.file.path; //req.file is the file in cloudinary in which the image is stored
    let fileName = req.file.filename;
    // console.log(url,"..",fileName);
    // let {title,description,image,price,location,country} = req.body; ... But we will noi use it rather we will make the inputs of the new.js 
    // ... a key value pair 
    // let listing = req.body.listing; // req.body.listing means the listing object is situated in the request body
    
    // Making a new document using mongoose inside Listing model with the user given data 

    const newListing = new Listing(req.body.listing); // If we are using this syntax we have to surely use the save function 
    // we have defined the listing object in the new.ejs file like - listing[price],listing[title] so we have to take the values of this listing 
    // ... object from the request body .
    console.log(req.user);
    newListing.owner = req.user._id; // Adding the owner id to the listing object
    newListing.image = {url, fileName}; // Adding the image object to the listing object image object has 2 keys, url and fileName

    newListing.geometry = response.features[0].geometry; // we will add the coordinates in the listing obj according to the listing schema 
    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success","Successfully created a new listing!"); // This flash msg will be shown while redirecting to "/listings"
    // req.flash("error","Some error occured");
    res.redirect("/listings");
});

module.exports.edit = (async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id); // To extract the previous value of the post 
    if(!listing){
        req.flash("error","Cannot find that listing!");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url; 
    originalImageUrl = originalImageUrl.replace("/upload","/upload/ar_1.0,c_fill,h_250/bo_5px_solid_lightblue");
    res.render("./listings/edit.ejs",{listing,originalImageUrl});
}); 

module.exports.update = (async(req,res) => { // isOwner is defined in middleware.js
    let {id} = req.params;
    // let listing = await Listing.findById(id);
    // if(req.user && !listing.owner.equals(req.user._id)){
    //     req.flash("error","You don't have permission to edit!");
    //     return res.redirect(`/listings/${id}`); 
    // }
    // Update the other data at first 
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing}); // The updated value is {...req.body.listing}  [...spreaded object]
    
    // Now if req.file(for the image) is there update the url and filename of the image 
    if(typeof req.file !== "undefined"){ // if req.file exixts,so new image is stored so we have to save the new image 
    let url = req.file.path;
    let filename = req.file.filename; // Adding the image object to the listing object image object has 2 keys, url and fileName
    listing.image={url, filename};
    // Now we have to save it, while using findByIdAndUpdate .save() is not needed but we have edited it once again so .save() is used 
    await listing.save();
    }

    req.flash("success","Successfully updated the listing!");
    res.redirect(`/listings/${id}`); // redirecting to the show route
})

module.exports.delete = (async(req,res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id); // when findByIdAndDelete(id) is called the post mongoose middleware which
    // ... we have defined in the listing.js will also be called and all the reviews associated with the listing will also be deleted 
    console.log(deletedListing);
    req.flash("success","Successfully deleted listing!");
    res.redirect("/listings");
});