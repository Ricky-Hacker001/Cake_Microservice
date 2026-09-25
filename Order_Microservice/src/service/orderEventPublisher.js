const { getChannel } = require("./rabbitmq") 
const QUEUE_NAME = "order_completed_queue" 
const logger = require("../logger") 

const publishOrderCompleted = async (order) => {
    try {
        const channel = await getChannel() 
        if (!channel) {
            throw new Error("RabbitMQ channel unavailable") 
        }

        const event = {
            event: "ORDER_COMPLETED",
            orderId: order._id.toString(),
            customerName: order.customerName,
            email: order.email,
            totalPrice: order.totalPrice
        } 

        const sent = channel.sendToQueue(
            QUEUE_NAME, 
            Buffer.from(JSON.stringify(event)), 
            { persistent: true }
        ) 

        if (sent) {
            console.log("ORDER_COMPLETED event published:", event) 
            logger.info("ORDER_COMPLETED event published", {
                event: event.event,
                orderId: event.orderId,
                customerName: event.customerName,
                email: event.email,
                totalPrice: event.totalPrice
            }) 
        }
    } catch (err) {
        logger.error("Failed to publish ORDER_COMPLETED event", {
            error: err.message,
            orderId: order._id ? order._id.toString() : undefined
        }) 
        console.error("Failed to publish event:", err.message) 
    }
} 

module.exports = publishOrderCompleted 