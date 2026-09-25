const { body } = require("express-validator")

const validateOrder = [
    body("basketId").notEmpty().withMessage("Basket ID is required").isMongoId().withMessage("Invalid Basket ID"),
    body("customerName").trim().notEmpty().withMessage("Customer name is required"),
    body("email").trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email address"),
    body("phone").trim().notEmpty().withMessage("Phone number is required").isMobilePhone("en-IN").withMessage("Invalid phone number"),
    body("address").trim().notEmpty().withMessage("Address is required").isLength({ min: 5 }).withMessage("Address must contain at least 5 characters")
]
const validateOrderStatus = [
  body("status").notEmpty().withMessage("Order status is required").isIn(["Pending", "Processing", "Completed", "Cancelled"]).withMessage("Invalid order status")
];

module.exports = {validateOrder,validateOrderStatus}