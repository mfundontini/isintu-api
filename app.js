// Third party imports
const dotenv = require("dotenv");
const express = require("express");
const morgan = require("morgan");

const APIError = require("./utils/apiError");

dotenv.config({ path: "./config.env"});

// Local imports
const usersRouter = require("./routes/usersRoutes");
const proverbsRouter = require("./routes/proverbsRoutes");

// Vars and configs
const server = express();

/* Middleware stack in sequential order */

// Morgan for logging incoming requests
server.use(morgan('dev'));

// `express.json()` as the body-parser
server.use(express.json());

// POST validation middleware
server.use((request, response, next) => {

  // Make sure all POST requests have data
  if(request.method == "POST" || request.method == "PATCH"){
    if(Object.keys(request.body).length === 0) {
      console.log("Empty post data");
      return response.status(401).json({
        status: "Fail",
        message: "Empty body supplied."
      });
    }
    // Give the incoming request an updated at date.
    else request.body.updated = Date.now();
  }
  next();
});


// App routing
server.use('/api/v1/proverbs', proverbsRouter);
server.use('/api/v1/users', usersRouter);

// Unmatched paths
server.all("*", (request, response, next) => {
  next(new APIError(`The resource ${request.path} is not found on this server`, 404, "Not found."));
});

server.use((error, request, response, next) => {
  console.log(error.stack);
  const status = error.statusCode || 500;
  const statusMessage = error.statusMessage || "Fail";

  response.status(status).json({
    status: statusMessage,
    message: error.message
  });
});

module.exports = server;