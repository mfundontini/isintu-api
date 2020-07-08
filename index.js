// Core imports
const filesystem = require("fs");

// Third party imports
const express = require("express");

// Vars and configs
const data = JSON.parse(filesystem.readFileSync(`${__dirname}/data/database.json`));
const server = express();
const PORT = 3000;

// Server config and middlewares
server.use(express.json());

// Route handlers
server.get("/api/v1/proverbs", (request, response) => {
  response.status(200).json({
    status: "success",
    results: data.length,
    data
  });
});

server.get("/api/v1/proverbs/:id", (request, response) => {
  // Get id from url
  let id = request.params.id * 1;

  let proverb = data.find(element => element.id === id);
  console.log(id, proverb);

  if(!proverb) return response.status(404).json({
    status: "Fail",
    message: "Not found"
  });

  response.status(200).json({
    status: "success",
    proverb
  });
});

server.listen(PORT, (err) => {

  if(err) return console.log(`Could not start server at port: ${PORT}`);
  console.log(`Running server at port: ${PORT}`);
});
