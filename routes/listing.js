const express=require('express');
const wrapAsync = require('../utils/wrapAsync');
const Listing = require('../models/listing');
const { connect } = require('mongoose');
const { isLoggedIn, isOwner, validateListing } = require('../middleware.js');
const listingController  = require('../controller/listing.js');
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage});

const router=express.Router();


router.route("/").get(wrapAsync(listingController.index))
.post( upload.single('listing[image]'),validateListing,wrapAsync(listingController.createListingRoute));

router.get('/filter/:category',listingController.filter);

//new router
router.get("/new",isLoggedIn,listingController.newFormRoute);

router.route("/:id").get(wrapAsync(listingController.showListingRoute))
.patch(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListingRoute))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListingRoute));


//edit router
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.editRoute));
  
  module.exports=router;