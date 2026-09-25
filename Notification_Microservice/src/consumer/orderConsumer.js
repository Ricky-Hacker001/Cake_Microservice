const { connectRabbitMQ, getChannel } = require("../service/rabbitmqService")  
const Notification = require("../model/notificationSchema")  
const validateOrderCompletedEvent = require("../middleware/eventValidation.js")  
const logger = require("../logger")  

const QUEUE_NAME = "order_completed_queue"  

const startOrderConsumer = async () => {
    try {
        const channel = await getChannel()  
        if (!channel) {
            throw new Error("Unable to obtain RabbitMQ channel")  
        }

        await channel.assertQueue(QUEUE_NAME, { durable: true })  
        console.log(`Waiting for messages from ${QUEUE_NAME}`)  
        logger.info("RabbitMQ consumer waiting for messages", { queue: QUEUE_NAME })  

        channel.consume(QUEUE_NAME, async (message) => {
            if (!message) return  

            try {
                const event = JSON.parse(message.content.toString())  
                const validation = validateOrderCompletedEvent(event)  

                if (!validation.valid) {
                    console.log("Invalid ORDER_COMPLETED event:", validation.message)  
                    logger.info("Invalid ORDER_COMPLETED event", { message: validation.message })  
                    channel.nack(message, false, false)  
                    return  
                }

                console.log("Order completed event received")  
                logger.info("ORDER_COMPLETED event received", {
                    event: event.event,
                    orderId: event.orderId,
                    customerName: event.customerName,
                    email: event.email,
                    totalPrice: event.totalPrice
                })  

                const { orderId, customerName, email, totalPrice } = event  
                const notificationMessage = `Hello ${customerName}, your order ${orderId} has been completed successfully. Total amount: ${totalPrice}`  

                const notification = new Notification({
                    orderId,
                    customerName,
                    email,
                    message: notificationMessage,
                    status: "Unread"
                })  

                await notification.save()  
                console.log("Notification saved successfully")  
                logger.info("Notification saved successfully", {
                    notificationId: notification._id,
                    orderId,
                    email,
                    status: notification.status
                })  

                channel.ack(message)  
            } catch (err) {
                console.log("Processing error:", err.message)  
                logger.error("Failed to process ORDER_COMPLETED event", { error: err.message })  
                channel.nack(message, false, false)  
            }
        })  
    } catch (err) {
        logger.error("Failed to start order consumer", { error: err.message })  
        console.log("Failed to start consumer:", err.message)  
        // Retry starting consumer if initial setup fails
        setTimeout(startOrderConsumer, 5000)  
    }
}  

module.exports = startOrderConsumer  