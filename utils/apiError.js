class APIError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.status = `${status}`.startsWith("4") ? "Fail" : "Error";
        this.statusCode = statusCode;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = APIError;
