const mongo = require("mongoose")

const connectDb = async()=>{
    try{
        await mongo.connect(process.env.MONGO_URL)
        console.log("DB connected")
    }catch(err){
        console.log(err.message)
    }
}

module.exports = connectDb