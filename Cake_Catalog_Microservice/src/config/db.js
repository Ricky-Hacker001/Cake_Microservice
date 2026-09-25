const mongo = require("mongoose");

const connectDB = async()=>{
    try{
        await mongo.connect(process.env.MONGO_URL)
        console.log("DB connected successfully");
    }catch(err){
        console.log(err.message);
    }
}

module.exports = connectDB;