const { body } = require("express-validator");

const validateRating = [
    body("cakeId").notEmpty().withMessage("Cake ID is required"),
    body("customerName").trim().notEmpty().withMessage("Customer name is required"),
    body("rating").notEmpty().withMessage("Rating is required").isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5"),
    body("review").optional().trim().isLength({ max: 500 }).withMessage("Review cannot exceed 500 characters")
];

module.exports = validateRating;