// Here we are going to initialize the data set that is insert the dataset to our database !

const mongoose = require ("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlast';
main()
.then(() => {
    console.log("connection successful");
})
.catch(() => {
    console.log("Error occured!")
});

async function main(){
    await mongoose.connect(MONGO_URL);
}

const  initDB = async () => {
    await Listing.deleteMany({});  // First we will clear all the data from our database
    initData.data = initData.data.map((obj) => ({...obj, owner : '67eeb76c5cbf6f9678c5d9d3'})); // Adding the owner id with all the listing data
    //...it will generate a new array of objects having the new "owner" key with the others key-value pairs they have had

    await Listing.insertMany(initData.data); // WE have already required the sampleListings object as initData and to access the data we have to 
                                            // Use the data key as declared in the data.js file 
    console.log("Data was initialized");

}

initDB();

