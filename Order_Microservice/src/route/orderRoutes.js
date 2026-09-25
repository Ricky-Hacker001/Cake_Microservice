const express = require('express');
const router = express.Router()
const Order = require('../model/orderSchema.js');
const Basket = require('../model/basketSchema.js');
const {validateOrder,validateOrderStatus} = require("../middleware/orderValidation.js");
const validateRequest = require("../middleware/validationMiddleware.js");
const publishOrderCompleted = require("../service/orderEventPublisher.js")
const logger = require("../logger");

router.post("/checkout",validateOrder, validateRequest, async(req,res)=>{
    try{
        const {basketId, customerName, email, address, phone}=req.body;
        if(!basketId || !customerName || !email || !address || !phone){
            return res.status(400).send({message:"basketId, customerName, email, address and phone are required"});
        }

        const basket = await Basket.findById(basketId)
        if(!basket){
            return res.status(404).send({message:"Basket not found"});
        }

        if(!basket.items || basket.items.length===0){
            return res.status(400).send({message:"Basket is empty"});
        }

        const totalPrice = basket.items.reduce((total,item)=>{ return total+item.price*item.quantity},0);
        const order = new Order({
            customerName,
            email,
            phone,
            address,
            items:basket.items,
            totalPrice,
            status:"Pending"
        })

        const savedOrder = await order.save();
        logger.info("Order placed successfully", {
            orderId: savedOrder._id,
            customerName: savedOrder.customerName,
            email: savedOrder.email,
            totalPrice: savedOrder.totalPrice
        })
        await Basket.findByIdAndDelete(basketId)
        logger.info("Basket deleted after checkout", {
            basketId,
            orderId: savedOrder._id
        })
        res.status(200).send({
            message:"Order placed successfully",
            orderId: savedOrder._id,
            order: savedOrder
        })

    }catch(err){
        console.log(err.message);
        logger.warn("Internal server error", {
            error:err.message
        })
        res.status(500).send({message:"internal server error"})
    }
})

router.get("/", async(req,res)=>{
    try{
        const order = await Order.find()
        logger.info("All orders retrieved", {
            count: order.length
        })
        res.status(200).send(order)
    }catch(err){
        console.log(err.message)
        logger.warn("Internal server error", {
            error:err.message
        })
        res.status(500).send({message:"Internal server error"})
    }
    
})

router.get("/:orderId", async(req,res)=>{
    try{
        logger.info("Order retrieved", {
            orderId: req.params.orderId
        })
        const order = await Order.findById(req.params.orderId)
        if(!order){
            return res.status(404).send({message:"Order Not found"})
        }
        res.status(200).send(order)
    }catch(err){
        console.log(err.message)
        logger.warn("Internal server error", {
            error:err.message
        })
        res.status(500).send({message:"Internal server error"})
    }
})


router.patch("/:orderId/status",validateOrderStatus, validateRequest, async(req,res)=>{
    try{
        const {status}= req.body
        const validateStatuse=["Pending","Processing","Completed","Cancelled"]
        if(!validateStatuse.includes(status)){
            return res.status(400).send({message:"Invalid order status"})
        }
        const order = await Order.findById(req.params.orderId)
        if(!order){
            return res.status(404).send({message:"Order not found"})
        }  
        order.status = status
        const updatedOrder = await order.save()
        logger.info("Order status updated", {
            orderId: updatedOrder._id,
            status: updatedOrder.status
        })
        if(status==="Completed"){
            await publishOrderCompleted(updatedOrder)
        }
        logger.info("ORDER_COMPLETED event published", {
            orderId: updatedOrder._id,
            customerName: updatedOrder.customerName,
            email: updatedOrder.email,
            totalPrice: updatedOrder.totalPrice
        })
        res.status(200).send({message:"Order status updated",updatedOrder})
    }catch(err){
        console.log(err.message)
        logger.warn("Internal server error", {
            error:err.message
        })
        res.status(500).send({message:"Internal server error"})
    }
})


module.exports = router