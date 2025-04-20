const Joi = require('joi'); // Server side schema validation using Joi package 


module.exports.listingSchema = Joi.object({// The name of the Joi object is listing
    listing: Joi.object({ // The request must have a listing object in it And the listing object should have the following properties :-
        title: Joi.string().required(), // The title is a string and it is required
        description: Joi.string().required(), 
        image: Joi.string().allow("", null), 
        price: Joi.number().min(0).required(),
        location: Joi.string().required(),
        country: Joi.string().required()
    }).required() // The listing object is required for execution of the request 
});

module.exports.reviewSchema = Joi.object({
    review:Joi.object({
        rating: Joi.number().min(1).max(5).required(),
        comment : Joi.string().required()

       
    }).required()
})
