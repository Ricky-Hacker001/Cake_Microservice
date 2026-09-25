const express = require("express") 
const router = express.Router() 
const axios = require("axios") 
const Rating =require("../model/ratingSchema.js") 
const validateRating =require("../middleware/ratingValidation.js") 
const validateRequest =require("../middleware/validationMiddleware.js") 
const logger = require("../logger") 

const CAKE_CATALOG_URL =process.env.CAKE_CATALOG_URL 

router.post("/",validateRating,validateRequest,async (req,res) => {
    try {
        const {cakeId,customerName,rating,review} = req.body
        let cakeResponse
        try {
            cakeResponse = await axios.get(`${CAKE_CATALOG_URL}/cakes/${cakeId}`)
        } catch (err) {
            if (err.response &&err.response.status === 404){
                logger.warn("Rating rejected - cake not found", {
                    cakeId
                })
                return res.status(404).send({message:"Cannot submit rating. Cake not found in catalog."})
            }
            logger.error("Cake catalog request failed", {
                cakeId,
                error: err.message
            })
            console.log(err.message)
        }
        const cake = cakeResponse.data 
        const newRating = new Rating({cakeId,customerName,rating,review})
        const savedRating =await newRating.save()
        logger.info("Rating submitted successfully", {
            ratingId: savedRating._id,
            cakeId,
            customerName,
            rating
        })
        res.status(201).send({message:"Rating submitted successfully",rating: savedRating})
    } catch (err) {
        console.log(err.message)
        logger.error("Rating submission failed", {
            error: err.message,
            cakeId: req.body.cakeId
        })
        res.status(500).send({message: "Internal Server Error"})
    }
})

router.get("/cake/:cakeId", async (req, res) => {
    try {
        const { cakeId } = req.params
        try {
            await axios.get(`${CAKE_CATALOG_URL}/cakes/${cakeId}`)
            logger.info("Fetching cake ratings", {
                cakeId
            })
        } catch (err) {
            if (err.response && err.response.status === 404){
                logger.warn("Cake not found while fetching ratings", {
                    cakeId
                })
                return res.status(404).send({message: "Cake not found in catalog"})
            }
            console.log(err.message)
            logger.error("Cake catalog request failed", {
                cakeId,
                error: err.message
            })
        }
        const ratings = await Rating.find({
            cakeId: cakeId
        }).sort({
            createdAt: -1
        })
        logger.info("Cake ratings retrieved", {
            cakeId,
            totalRatings: ratings.length
        })
        res.status(200).send({cakeId: cakeId,totalRatings: ratings.length,ratings: ratings})
    } catch (err) {
        console.log(err.message)
        logger.error("Failed to fetch cake ratings", {
            cakeId: req.params.cakeId,
            error: err.message
        })
        res.status(500).send({message: "Internal Server Error"})
    }
})

router.get("/cake/:cakeId/average", async (req, res) => {
    try {
        const { cakeId } = req.params  

        logger.info("Calculating average cake rating", { cakeId })  

        try {
            await axios.get(`${CAKE_CATALOG_URL}/cakes/${cakeId}`)  
        } catch (err) {
            if (err.response && err.response.status === 404) {
                logger.warn("Cake not found while calculating average rating", { cakeId })  
                return res.status(404).send({ message: "Cake not found in catalog" })  
            }
            logger.error("Cake catalog request failed", { cakeId, error: err.message })  
            return res.status(500).send({ message: "Cake catalog service unavailable" })  
        }

        const result = await Rating.aggregate([
            {
                $match: { cakeId: cakeId }
            },
            {
                $group: {
                    _id: "$cakeId",
                    avgScore: { $avg: "$rating" },
                    totalCount: { $sum: 1 }
                }
            }
        ])  

        if (!result || result.length === 0) {
            logger.info("No ratings found for cake", { cakeId })  
            return res.status(200).send({
                cakeId: cakeId,
                averageRating: 0,
                totalRatings: 0
            })  
        }

        const calculatedAverage = Number(result[0].avgScore.toFixed(1))  
        const calculatedTotal = result[0].totalCount  

        logger.info("Cake average rating calculated", {
            cakeId,
            averageRating: calculatedAverage,
            totalRatings: calculatedTotal
        })  

        return res.status(200).send({
            cakeId: cakeId,
            averageRating: calculatedAverage,
            totalRatings: calculatedTotal
        })  

    } catch (err) {
        logger.error("Failed to calculate average rating", {
            cakeId: req.params.cakeId,
            error: err.message
        })  

        console.log("Average rating error:", err.message)  

        return res.status(500).send({
            message: "Internal Server Error"
        })  
    }
})  

module.exports=router