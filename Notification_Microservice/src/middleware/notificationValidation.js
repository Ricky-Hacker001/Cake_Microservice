const { param } = require("express-validator");

const validateEmail = [
    param("email").trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email address")
]

const validateNotificationId = [
    param("notificationId").notEmpty().withMessage("Notification ID is required").isMongoId().withMessage("Invalid notification ID")
]


module.exports = {validateEmail,validateNotificationId};