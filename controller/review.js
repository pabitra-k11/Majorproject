const Listing = require("../models/listing");
const Review = require("../models/review");


module.exports.createReview=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    const newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    listing.review.push(newReview);
    await newReview.save();
    await listing.save();
  
    req.flash("success","new review created!");
   // req.flash("error","some error occured!");
    res.redirect(`/listings/${id}`);
 };

 module.exports.destroyReeview=async(req,res)=>{
    let{id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{review:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","review deleted!");
    //req.flash("error","some error occured!");
    res.redirect(`/listings/${id}`);
 };