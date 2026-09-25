const mongo = require("mongoose");

const connectDB = async () => {
    try {
        await mongo.connect(process.env.MONGO_URL);
        console.log("Rating DB connected");
    } catch (err) {
        console.log(err.message)
    }
};

module.exports = connectDB;