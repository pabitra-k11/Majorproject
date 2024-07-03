const express=require('express');
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware');
const userController = require('../controller/user');

const router=express.Router();

router.route("/signup").get(userController.signupForm)
.post(wrapAsync(userController.createUser));


//login form
router.get("/login",userController.loginForm);


// router.get("/login", (req, res) => {
//     res.render("./users/login.ejs");
//   });
 
//login route
  router.post("/login",saveRedirectUrl, passport.authenticate('local', {
    failureRedirect: "/login",
    failureFlash: true
  }), userController.loginUser);

// logout route
router.get("/logout",userController.userLogout);



module.exports=router;