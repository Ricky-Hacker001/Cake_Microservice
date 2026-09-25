const express = require('express');
const router = express.Router();
const Basket = require('../model/basketSchema.js');
const {validateBasketItem,validateQuantity} = require("../middleware/basketValidation.js");
const validateRequest =require("../middleware/validationMiddleware.js");
const CAKE_CATALOG_URL = process.env.CAKE_CATALOG_URL;
const logger = require("../logger");

const axios = require('axios');

// Basket routes
router.get("/", (req,res)=>{
    res.status(200).send({message:"basket route"})
})

// add item to the basket
router.post("/items",validateBasketItem,validateRequest, async (req,res)=>{
    try{
        const {basketId, cakeId, quantity}=req.body;
        if(!cakeId){
            return res.status("400").send({message:"cake is required"});
        }
        const itemQuantity = quantity || 1;
        const cakeResponse = await axios.get(`${CAKE_CATALOG_URL}/cakes/${cakeId}`)
        console.log(cakeResponse);
        console.log(cakeResponse.data);
        const cake = cakeResponse.data;
        if(!cake.availability){
            return res.status(400).send({message:"Cake is currently unavailable"});
        }

        // check if basket exists if not create a new basket
        let basket;
        if(basketId){
            basket = await Basket.findById(basketId);
        }
        if(!basket){
            basket = new Basket({
                items: []
            });
        }

        // check if the cake already exists in the basket
        const existingItem = basket.items.find((item)=>item.cakeId===cakeId);

        if(existingItem){
            existingItem.quantity+=Number(itemQuantity);
        }else{
            basket.items.push({
                cakeId: cake._id.toString(),
                name: cake.name,
                price: cake.price,
                quantity: Number(itemQuantity),
                imageUrl: cake.imageUrl
            })
        }
        const savedBasket = await basket.save()
        logger.info("Cake added to basket", {
            basketId: savedBasket._id,
            cakeId: cake._id,
            quantity: Number(itemQuantity)
        })

        res.status(200).send({
            message:"cake added to the basket successfully",
            basketId: savedBasket._id,
            basket: savedBasket
        })

    }catch(err){
        console.error(err.message);
        logger.error("Failed to add cake to basket", {
            error: err.message,
            basketId,
            cakeId
        })
        if(err.cakeResponse && err.cakeResponse.status === 404){
            return res.status(404).send({message:"cake not found"})
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


// get basket by id
router.get("/:basketId",async (req,res)=>{
    try{
        const basket = await Basket.findById(req.params.basketId)
        if(!basket){
            return res.status(404).send({message:"Basket Not found"})
        }
        logger.info("Basket", {
            basketId: req.params.basketId
        })
        res.status(200).send(basket)

    }catch(err){
        logger.warn("Internal server error", {
            error:err.message
        })
        res.status(500).send({message:"Internal server error"})
    }
})

// update item quantity in the basket
router.put("/:basketId/items/:cakeId",validateQuantity,validateRequest,async (req,res)=>{
    try{
        const {quantity} =req.body;
        if(!quantity||Number(quantity)<1){
            return res.status(400).send({message:"Quantity must be at least 1"})
        }
        const basket = await Basket.findById(req.params.basketId)

        if(!basket){
            return res.status(404).send({message:"Basket not found"})
        }

        const item = basket.items.find(
            (item)=>item.cakeId===req.params.cakeId
        )
        if(!item){
            return res.status(404).send({message:"Cake not found in the basket"})
        }
        item.quantity = Number(quantity)
        const updatedBasket = await basket.save()
        logger.info("Basket item quantity updated", {
            basketId: req.params.basketId,
            cakeId: req.params.cakeId,
            quantity: Number(quantity)
        })
        res.status(200).send({message:"Basket updated successfully",updatedBasket})

    }catch(err){
        logger.warn("Internal server error", {
            err:err.message
        })
        return res.status(500).send({message:"Internal server error"})
    }
})

// delete item from the basket
router.delete("/:basketId/items/:cakeId",async (req,res)=>{
    try{
        const basket = await Basket.findById(req.params.basketId)
        if(!basket){
            return res.status(404).send({message:"Basket not found"})
        }
        const itemIndex = basket.items.findIndex((item)=>item.cakeId===req.params.cakeId)
        if(itemIndex===-1){
            return res.status(404).send({message:"Cake not found in the basket"})
        }
        basket.items.splice(itemIndex,1)
        await basket.save()
        logger.info("Cake removed from basket", {
            basketId: req.params.basketId,
            cakeId: req.params.cakeId
        })
        res.status(202).send({message:"Cake removed from the basket successfully"})

    }catch(err){
        logger.warn("Internal server error", {
            error:err.message
        })
        res.status(500).send({message:"Internal server error"})
    }
})

module.exports= router