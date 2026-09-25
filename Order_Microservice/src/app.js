require("dotenv").config();
const express = require('express');
const app = express();
const connectDB = require("./config/db.js");
const basketRoute = require("./route/basketRoutes.js")
const orderRoute = require("./route/orderRoutes.js")
const { connectRabbitMQ } = require("./service/rabbitmq.js")
const PORT = 3001;
const requestLogger = require("./middleware/requestLogger")
const logger = require("./logger")

app.use(express.json());
app.use(requestLogger)

app.use("/baskets",basketRoute)
app.use("/orders",orderRoute)

app.get("/",(req,res)=>{
    res.status(200).send({message:"Welcome to the Order Microservice!"});
}) 


const startServer = async()=>{
    try{
        await connectDB()
        await connectRabbitMQ()
        app.listen(PORT,()=>{
            console.log(`Order Microservice is running on port ${PORT}`)
            logger.info("Order Microservice started", {
                port: PORT
            })
        })
    }catch(err){
        console.log(err.message)
        logger.error("Order Microservice startup failed", {
            error: err.message
        })
        process.exit(1)
    }
}
startServer();