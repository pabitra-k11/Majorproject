const express=require('express');
const wrapAsync = require('../utils/wrapAsync');
const Listing = require('../models/listing');
const Review = require('../models/review');
const { validateReview, isLoggedIn, isAuthorReview } = require('../middleware');
const  reviewController  = require('../controller/review');
const router=express.Router({mergeParams:true});





//post route
router.post("/",isLoggedIn, validateReview,wrapAsync(reviewController.createReview));
 
 //delete route
 router.delete("/:reviewId",isLoggedIn,isAuthorReview,wrapAsync(reviewController.destroyReeview));
 
 module.exports=router;