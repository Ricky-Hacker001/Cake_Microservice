const express = require("express")
const router = express.Router()
const Notification = require("../model/notificationSchema")
const {validateEmail,validateNotificationId} = require("../middleware/notificationValidation.js")
const validateRequest =require("../middleware/validationMiddleware.js")
const logger = require("../logger");

router.get("/user/:email",validateEmail,validateRequest,async(req,res)=>{
    try{
        const notification = await Notification.find({
            email:req.params.email
        }).sort({
            createdAt:-1
        })
        logger.info(
            "User notifications retrieved",
            {
                email: req.params.email,
                count: notification.length
            }
        )
        res.status(200).send(notification)
    }catch(err){
        console.log(err.message)
        logger.error(
            "Failed to retrieve user notifications",
            {
                email: req.params.email,
                error: err.message
            }
        )
        res.status(500).send({message:"internal server error"})
    }
})

router.get("/user/:email/unread",validateEmail,validateRequest,async(req,res)=>{
    try{
        const notification=await Notification.find({
            email:req.params.email,
            status:"Unread"
        }).sort({
            createdAt:-1
        })
        logger.info(
            "Unread notifications retrieved",
            {
                email: req.params.email,
                count: notification.length
            }
        )
        res.status(200).send(notification)
    }catch(err){
        console.log(err.message)
        logger.error(
            "Failed to retrieve unread notifications",
            {
                email: req.params.email,
                error: err.message
            }
        )
        res.status(500).send({message:"Internal Server Error"})
    }
})

router.patch("/user/:notificationId/read",validateRequest,validateNotificationId,async(req,res)=>{
    try{
        const notification = await Notification.findById(req.params.notificationId)
        if(!notification){
            logger.warn(
                "Notification not found",
                {
                    notificationId:
                        req.params.notificationId
                }
            )
            return res.status(404).send({
                message:"Notification not found"
            })
        }
        notification.status="Read"
        const updatedNotification=await notification.save()
        logger.info(
            "Notification marked as read",
            {
                notificationId:updatedNotification._id,
                email:updatedNotification.email,
                orderId:updatedNotification.orderId
            }
        )
        res.status(200).send({
            message:"Notification marker as read",
            notification: updatedNotification
        })
    }catch(err){
        console.log(err.message)
        logger.error(
            "Failed to mark notification as read",
            {
                notificationId:req.params.notificationId,
                error: err.message
            }
        )
        res.status(500).send({
            message:"Internal Server Error"
        })
    }
})

module.exports=router