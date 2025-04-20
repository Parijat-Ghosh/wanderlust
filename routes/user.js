const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");// so that user can redirect to the page he was on before signing in


const userController = require("../controllers/users.js");
const user = require("../models/user.js");

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

// AFTER SUBMITTION OF FORM

router.post("/signup", wrapAsync(userController.signup));



//------------------------------------------------------------------------------------------------------------------------------------------------

router.get("/login", userController.renderLoginForm);

// AFTER SUBMITTION OF FORM

router.post("/login",
    saveRedirectUrl, 
    passport.authenticate("local",{
        failureRedirect:"/login",
        failureFlash: true,
    }),userController.login
);

// LOGOUT USER ROUTE

router.get("/logout", userController.logout);

module.exports = router;  