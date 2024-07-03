const mongoose=require('mongoose');
const Listing =require('../models/listing.js');
const initData=require('./data.js');

main().then(()=>{
    console.log("connected to db!");
}).catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDB= async ()=>{
    await Listing.deleteMany({});
    initData.data= initData.data.map((obj)=>({...obj,owner:"6675c50aac100b230447fcba"}));
    await Listing.insertMany(initData.data);
    console.log("Data was intialized!");

}

initDB();