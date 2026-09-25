const mongo = require("mongoose")

const ratingSchema = new mongo.Schema(
    {
        cakeId: {
            type: String,
            required: true
        },
        customerName: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        review: {
            type: String,
            required: false
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongo.model("Rating",ratingSchema)