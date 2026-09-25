const logger = require("../logger");

const requestLogger = (req, res, next) => {

    const start = Date.now();

    res.on("finish", () => {

        const duration = Date.now() - start;

        logger.info("HTTP Request", {
            method: req.method,
            url: req.originalUrl,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip
        });

    });

    next();
};

module.exports = requestLogger;