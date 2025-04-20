const User = require("../models/user.js");


module.exports.signup = (async(req, res) => {
    try{  // We are using try catch with wrapAsync only to show a flash message 
        let {username, email, password} = req.body; // Destructuring info from the form 
        const newUser = new User({email,username}); // Creating a new user
        const registeredUser = await User.register(newUser,password);  // register(user, password, cb)
        console.log(registeredUser);
        req.login(registeredUser,(err) => { // To login the user automatically after signing in (login - passport function)
            if (err) {    // login function takes 2 parameters , userinfo and error callback function
                return next(err);
            }
            req.flash("success","Successfully signed up!");
            res.redirect("/listings");
        });
        
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
});

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs"); // Render will seek into the views folder so the path is set like that
};

module.exports.login = async(req,res) => {   // After successful authentication
    req.flash("success","Successfully logged in!");
    let redirectUrl = res.locals.redirectUrl || "/listings"; // if res.locals.redirectUrl exists then assign it to redirectUrl 
    // ... else assign "/listings"
    res.redirect(redirectUrl); // req.session.redirectUrl(middleware.js) is saved in the middleware isLoggedIn
};

module.exports.logout = (req, res,next) => { // this route handler itself is acting as middleware in the Express.js sense
    req.logout((err) => { // req.logout() is a passport function to log out the user
        if (err) {
            return next(err); // as there is no error handler in this file , so express will seek for the global error handler for next(err)
        } // return keyword is used to stop the execution of the function if an error occure so that the next lines shalln't be executed 

        req.flash("success","Successfully logged out!");
        res.redirect("/listings");
    });
}