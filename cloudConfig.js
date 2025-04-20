const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,  // This key names are bydefault 
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});


const storage = new CloudinaryStorage({ // declaring where to store the files
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust_DEV',
      allowedFormats:['jpg', 'png', 'jpeg'], // supports promises as well
    },
  });

  module.exports = {
    cloudinary,
    storage
  }