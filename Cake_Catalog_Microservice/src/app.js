require("dotenv").config();
const express = require('express');
const app = express();
const connectDB = require("./config/db.js");
const cakeRoutes = require("./route/cakeRoutes.js");
const path = require("path");
const requestLogger = require("./middleware/requestLogger");
const logger = require("./logger");

const port = 3000;

// Middleware
app.use(express.json())
app.use(requestLogger);
app.use("/cakes",cakeRoutes);

app.use(
  "/cake-images",
  express.static(path.join(__dirname, "cake_Images"))
);

// Simple route for testing
app.get("/",(req,res)=>{
    res.status(200).send({message:"Welcome to the Cake Catalog Microservice!"});
})

// start the server after connecting to the database
const startServer = async()=>{
    try{
        // db connection
        await connectDB()
        // Server listening
        app.listen(port, ()=>{
            console.log(`Cake Catalog Microservice is running on port ${port}`);
            logger.info("Cake Catalog Microservice started", {
                port: port
            })
        })
    }catch(err){
        console.log(err.message);  
        logger.error("Database operation failed", {
            error: err.message
        }); 
    }
}

// Start the server function call
startServer();