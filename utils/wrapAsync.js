module.exports = (fn) => { // WrapAsync fn is used to get rid of the try catch block at every routing while handliung errors 
    return (req,res,next) => {
        fn(req,res,next).catch(next);
    };
};