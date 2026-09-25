const winston = require("winston");

const logger = winston.createLogger({
    level: "info",

    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),

    transports: [

        // Terminal
        new winston.transports.Console(),

        // All logs
        new winston.transports.File({
            filename: "logs/combined.log"
        }),

        // Error logs only
        new winston.transports.File({
            filename: "logs/error.log",
            level: "error"
        })
    ]
});

module.exports = logger;