const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    try {
        let allListing = await Listing.find({});
        res.render("./listings/index.ejs", { allListing });
    } catch (error) {
        console.error("Error fetching listings:", error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports.filter = async (req, res) => {
    try {
        const { category } = req.params;
        const allListing = await Listing.find({ category });
        res.render('./listings/index.ejs', { allListing });
    } catch (error) {
        console.error("Error filtering listings:", error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports.countryByFilter= async (req, res)=>{
    try {
        const { country } = req.params;

        if(!country){
            req.flash("error","please enter a country to search");
            res.redirect("/listings");
        }
        const allListing = await Listing.find({ country});
        res.render('./listings/index.ejs', { allListing });
    } catch (error) {
        console.error("Error searching listings by country:", error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports.newFormRoute = (req, res) => {
    res.render("./listings/new.ejs");
};

module.exports.showListingRoute = async (req, res, next) => {
    try {
        let { id } = req.params;
        let listing = await Listing.findById(id)
            .populate({ path: "review", populate: { path: "author" } })
            .populate("owner");
        if (!listing) {
            req.flash("error", "Listing you requested for does not exist!");
            return res.redirect("/listings");
        }
        res.render("./listings/show.ejs", { listing });
    } catch (error) {
        console.error("Error showing listing:", error);
        next(error);
    }
};

module.exports.createListingRoute = async (req, res, next) => {
    try {
        console.log("Received request to create listing");
        const startTime = Date.now();

        // Geocoding request
        let response = await geocodingClient.forwardGeocode({
            query: req.body.listing.location,
            limit: 1
        }).send();

        console.log(`Geocoding request took ${Date.now() - startTime}ms`);

        // Process image
        let url = req.file.path;
        let filename = req.file.filename;
        let newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = { url, filename };
        newListing.geometry = response.body.features[0].geometry;
        newListing.category = req.body.listing.category;

        // Save listing
        let savedListing = await newListing.save();
        console.log(`Saving listing took ${Date.now() - startTime}ms`);

        req.flash("success", "New listing created!");
        res.redirect("/listings");
    } catch (error) {
        console.error("Error creating listing:", error);
        next(error);
    }
};

module.exports.editRoute = async (req, res, next) => {
    try {
        let { id } = req.params;
        let listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing you requested for does not exist!");
            return res.redirect("/listings");
        }
        let originalImage = listing.image.url.replace("/upload", "/upload/w_250");
        res.render("./listings/edit.ejs", { listing, originalImage });
    } catch (error) {
        console.error("Error editing listing:", error);
        next(error);
    }
};

module.exports.updateListingRoute = async (req, res, next) => {
    try {
        let { id } = req.params;
        let newUpdateListing = req.body.listing;
        let newListing = await Listing.findByIdAndUpdate(id, { ...newUpdateListing }, { runValidators: true });

        if (req.file) {
            let url = req.file.path;
            let filename = req.file.filename;
            newListing.image = { url, filename };
            await newListing.save();
        }

        req.flash("success", "Listing updated!");
        res.redirect(`/listings/${id}`);
    } catch (error) {
        console.error("Error updating listing:", error);
        next(error);
    }
};

module.exports.destroyListingRoute = async (req, res, next) => {
    try {
        let { id } = req.params;
        await Listing.findByIdAndDelete(id);
        req.flash("success", "Listing deleted!");
        res.redirect("/listings");
    } catch (error) {
        console.error("Error deleting listing:", error);
        next(error);
    }
};
