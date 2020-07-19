class APIError extends Error {
    constructor(message, statusCode, statusMessage) {
        super(message);
        this.statusMessage = statusMessage;
        this.statusCode = statusCode;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = APIError;
