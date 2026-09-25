require("dotenv").config()
const express = require("express")
const app = express()
const connectDb = require("./config/db")
const startOrderConsumer = require("./consumer/orderConsumer")
const notificationRoutes = require("./route/notificationRoutes")
const PORT = 3002
const requestLogger = require("./middleware/requestLogger")
const logger = require("./logger")

app.use(express.json())
app.use(requestLogger)

app.use("/notifications", notificationRoutes);
app.get("/",(req,res)=>{
    res.status(200).send({message:"Notification service"})
})


const startServer = async()=>{
    try{
        await connectDb()
        await startOrderConsumer()
        app.listen(PORT,()=>{
            console.log(`Notification service is running on ${PORT}`)
            logger.info("Notification Microservice started", {
                port: PORT
            })
        })
    }catch(err){
        logger.error("Notification Microservice startup failed", {
            error: err.message
        })
        console.log(err.message)
    }
}
startServer()