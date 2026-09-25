const express = require('express');
const router = express.Router();
const Cake = require("../model/cakeModel.js");
const validateCake=require("../middleware/cakeValidation.js");
const validateRequest=require("../middleware/validationMiddleware.js");
const upload = require("../middleware/imageUploadMiddleware.js");
const fs = require("fs");
const path = require("path");
const logger = require("../logger");

// GET all cakes and Filter cake
router.get("/", async(req,res)=>{
    try{
        // getting the query parameters from the request
        const {name, category, maxPrice, minPrice, availability}=req.query;

        // empty filter object to store the filter values
        let filter={}

        // name filter
        if(name){
            filter.name={
                $regex:name,
                $options:"i"
            }
        }

        // category filter
        if(category){
            filter.category={
                $regex:category,
                $options:"i"
            }
        }

        // price filter
        if(maxPrice || minPrice){
            filter.price={};
            if(minPrice){
                filter.price.$gte=Number(minPrice);
            }
            if(maxPrice){
                filter.price.$lte=Number(maxPrice);
            }
        }

        // availability filter
        if(availability!==undefined){
            filter.availability=availability==="true";
        }

        const cake = await Cake.find(filter);
        res.status(200).send(cake);

    }catch(err){
        console.log(err.message);
        logger.error("Internal server error", {
            error: err.message
        })
        res.status(500).send({message:"Internal Server Error"});
    }
})

// Add a new cake
router.post("/", upload.single("image"), validateCake, validateRequest, async(req,res)=>{
    try{
        const{name, description, category, price, availability} = req.body;
        const cake = new Cake({
            name,
            description,
            category,
            price,
            availability,
            imageUrl: `/cake-images/${req.file.filename}`
        })
        console.log(cake);
        logger.info("Cake added successfully", {
            cakeId: cake._id,
            name: cake.name,
            category: cake.category,
            price: cake.price
        });
        const savedCake = await cake.save()
        res.status(201).send(savedCake);
    }catch(err){
        console.log(err.message);
        logger.error("Internal server error", {
            error: err.message
        })
        res.status(500).send({message:"Internal server Error"});
    }

})

// GET cake by ID
router.get("/:id", async(req,res)=>{
    try{
        const cake = await Cake.findById(req.params.id);
        if(!cake){
            return res.status(404).send({message:"Cake not found"});
        }
        res.status(200).send(cake);
    }catch(err){
        console.log(err.message);
        logger.error("Internal server error", {
            error: err.message
        })
        res.status(500).send({message:"Internal Server Error"});
    }
})

// Update cake by ID
router.put("/:id",upload.single("image"),validateCake,validateRequest,async (req, res) => {
    try{
        const cake = await Cake.findById(req.params.id)
        if (!cake) {
            return res.status(404).send({
            message: "Cake not found"
            })
        }
        const {name,description,category,price,availability} = req.body
        const oldImageUrl = cake.imageUrl;
        // Update cake details
        cake.name = name
        cake.description = description
        cake.category = category
        cake.price = price
        cake.availability = availability

        // If a new image was uploaded,
        // replace the old image URL
        if (req.file) {
            cake.imageUrl = `/cake-images/${req.file.filename}`
        }
        const updatedCake = await cake.save()

        // Delete old physical image
        if (req.file && oldImageUrl) {
            const oldImageName =path.basename(oldImageUrl);
            const oldImagePath = path.join(__dirname,"../cake_Images",oldImageName);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
                console.log("Old image deleted:",oldImagePath);
            }
        }
        console.log("Updated cake:",updatedCake)
        logger.info("Cake updated successfully", {
            cakeId: updatedCake._id
        })
        res.status(200).send(updatedCake)
    }catch(err){
        console.log(err.message)
        logger.error("Internal server error", {
            error: err.message
        })
        res.status(500).send({message: "Internal Server Error"})
    }
  }
)

// delete cake by id
router.delete("/:id", async(req,res)=>{
    try{
        const cake = await Cake.findById(req.params.id);
        if(!cake){
            return res.status(404).send({message:"cake not found"});
        }
        await cake.deleteOne();
        logger.info("Cake deleted successfully", {
            cakeId: req.params.id
        });
        res.status(204).send({message:"cake deleted successfully"});
    }catch(err){
        logger.error("Internal server error", {
            error: err.message
        })
        console.log(err.message);
        res.status(500).send({message:"Internal Server Error"});
    }
})

// exporting the router
module.exports = router;