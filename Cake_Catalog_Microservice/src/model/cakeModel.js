const mongo =require("mongoose");

// Cake schema for cake catalog microservice
const cakeSchema = new mongo.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    availability:{
        type:Boolean,
        required:true,
        default:true
    },
    imageUrl:{
        type:String,
        required:true
    }
})

module.exports = mongo.model("Cake",cakeSchema);