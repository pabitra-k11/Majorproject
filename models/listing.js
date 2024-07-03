const mongoose=require('mongoose');
const Review=require("./review.js");
const { ref, required } = require('joi');

const {Schema}=mongoose;
let sampleSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        url:String,
        filename:String,
       },
    price:{
        type:Number,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    review:[
        {
            type:Schema.Types.ObjectId,
            ref:'Review',
        },
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:'User',
    },
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
    category:{
        type:String,
        enum:["Moutains","Camping","Beach","Deserts","Rooms","Farms","Pools"],
        required:true,
    },
});

sampleSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
     await Review.deleteMany({_id:{$in:listing.review}});
    }
});
let Listing = mongoose.model("Listing",sampleSchema);

module.exports=Listing;