const errorHandler = (err, req, res, next) => {
    let { statusCode, message } = err;

    if (!statusCode) statusCode = 500;

    res.status(statusCode).json({
        success: false,
        message: statusCode === 500 ? "Internal Server Error" : message,
        stack: process.env.NODE_ENV === "development" ? err.stack : null,
    });
};
module.exports = errorHandler;