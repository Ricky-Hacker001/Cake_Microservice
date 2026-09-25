const { body } = require("express-validator")

const validateBasketItem = [
    body("cakeId").notEmpty().withMessage("Cake ID is required").isMongoId().withMessage("Invalid Cake ID"),
    body("quantity").optional().isInt({ min: 1 }).withMessage("Quantity must be a positive integer")
]

const validateQuantity = [
    body("quantity").notEmpty().withMessage("Quantity is required").isInt({ min: 1 }).withMessage("Quantity must be at least 1")
]

module.exports = {validateBasketItem, validateQuantity}
