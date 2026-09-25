require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./config/db.js");
const ratingRoutes = require("./route/ratingRoutes.js");
const PORT = 3003;
const requestLogger = require("./middleware/requestLogger");
const logger = require("./logger");

app.use(express.json());
app.use(requestLogger);
app.use("/ratings", ratingRoutes);

app.get("/", (req, res) => {
    res.status(200).send({message: "Rating Microservice"})
})

const startServer = async () => {
    try {
        await connectDB()
        app.listen(PORT, () => {
            console.log(`Rating Microservice is running on port ${PORT}`)
            logger.info("Rating Microservice started", {
                port: PORT
            })
        })

    } catch (err) {
        logger.error("Rating Microservice startup failed", {
            error: err.message
        })
        console.log(err.message)
    }
};

startServer()