// Third party imports
const express = require("express");
const morgan = require("morgan");
const { request, response } = require("express");

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
  if(request.method == "POST"){
    if(Object.keys(request.body).length === 0) {
      console.log("Empty post data");
      return response.status(401).json({
        status: "Fail",
        message: "Empty body supplied."
      });
    }
    // Give the incoming POST requests an updated at date.
    else request.body.updated = new Date().toISOString();
  }
  next();
});


// App routing
server.use('/api/v1/proverbs', proverbsRouter);
server.use('/api/v1/users', usersRouter);

module.exports = server;