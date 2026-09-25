const mongo = require("mongoose")

const notificationSchema = mongo.Schema({
    orderId: {
        type:String,
        required:true
    },
    customerName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },status: {
        type: String,
        enum: ["Unread", "Read"],
        default: "Unread"
    }
},
{
    timestamps: true
})

module.exports= mongo.model("Notification",notificationSchema)