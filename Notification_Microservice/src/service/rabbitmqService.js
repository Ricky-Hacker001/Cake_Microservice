const amqp = require("amqplib")  
const logger = require("../logger")  

let connection = null  
let channel = null  

const connectRabbitMQ = async () => {
    try {
        if (connection && channel) return channel  

        connection = await amqp.connect(process.env.RABBITMQ_URL || "amqp://rabbitmq:5672")  

        connection.on("error", (err) => {
            logger.error("RabbitMQ connection error", { error: err.message })  
            resetConnection()  
        })  

        connection.on("close", () => {
            logger.warn("RabbitMQ connection closed. Reconnecting...")  
            resetConnection()  
        })  

        channel = await connection.createChannel()  

        channel.on("error", (err) => {
            logger.error("RabbitMQ channel error", { error: err.message })  
            channel = null  
        })  

        channel.on("close", () => {
            logger.warn("RabbitMQ channel closed")  
            channel = null  
        })  

        console.log("RabbitMQ connected in notification-service")  
        logger.info("RabbitMQ connected in notification-service")  
        return channel  
    } catch (err) {
        logger.error("RabbitMQ connection failed in notification-service", { error: err.message })  
        console.log("RabbitMQ connection failed:", err.message)  
        setTimeout(connectRabbitMQ, 5000)  
    }
}  

const resetConnection = () => {
    connection = null  
    channel = null  
    setTimeout(connectRabbitMQ, 5000)  
}  

const getChannel = async () => {
    if (!channel) {
        return await connectRabbitMQ()  
    }
    return channel  
}  

module.exports = { connectRabbitMQ, getChannel }  