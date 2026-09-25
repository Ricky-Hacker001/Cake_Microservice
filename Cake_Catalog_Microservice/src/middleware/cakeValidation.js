const {body}=require("express-validator");

// validation for cake post and put request
const validateCake=[
    body("name").notEmpty().withMessage("Name is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("category").notEmpty().withMessage("Category is required"),
    body("price").isFloat({gt:0}).withMessage("Price must be a positive number"),
    body("availability").isBoolean().withMessage("Availability must be in true or false")
]

module.exports=validateCake;