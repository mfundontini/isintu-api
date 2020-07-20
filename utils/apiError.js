class APIError extends Error {
    constructor(message, statusCode, statusMessage) {
        super(message);
        this.statusMessage = statusMessage || "Fail.";
        this.statusCode = statusCode || 500;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = APIError;
