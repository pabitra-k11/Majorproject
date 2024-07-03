const User = require("../models/user");



module.exports.signupForm=async(req,res)=>{
    res.render("./users/signup.ejs");
   };

module.exports.createUser=async(req,res,next)=>{
    try{
        let{username,email,password}=req.body;
        let newUser=new User({username,email});
        let registerUser= await User.register(newUser,password);
       req.login(registerUser,(err)=>{
        if(err){
          return next(err)
        }
        req.flash("success","welcome to wanderlust");
        res.redirect("/listings");
       });

    }catch(er){
req.flash("error",er.message);
res.redirect("/signup");
    }

};

module.exports.loginForm=(req,res)=>{
    res.render("./users/login.ejs");
};

module.exports.loginUser=async (req, res) => {
    req.flash("success", "Welcome to Wanderlust");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  };

module.exports.userLogout=(req,res,next)=>{
    req.logOut((err)=>{
      if(err){
      return  next(err);
      }
      req.flash("success","you are logout!");
      res.redirect("/listings");
    });
  };