// Use a decorator-like construct to catch async errors
module.exports = (innerFunction) => {
    return (request, response, next) => {
        innerFunction(request, response, next).catch(next);
    };
};
