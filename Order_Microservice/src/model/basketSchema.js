const mongo = require('mongoose');

const basketSchema = new mongo.Schema({
    items:[
        {
            cakeId:{
                type:String,
                required:true
            },
            name:{
                type:String,
                required:true
            },
            price:{
                type:Number,
                required:true,
                min:0
            },
            quantity:{
                type:Number,
                required:true,
                min:1,
                default:1
            },
            imageUrl:{
                type:String,
                required:true
            }
        }
    ]},
    {
        timestamps: true
    }
)

module.exports = mongo.model('Basket', basketSchema);