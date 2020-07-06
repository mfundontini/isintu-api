// Core imports
const filesystem = require("fs");

// Third party imports
const express = require("express");

// Vars and configs
const data = JSON.parse(filesystem.readFileSync(`${__dirname}/data/database.json`));
const server = express();
const PORT = 3000;

// Route handlers
server.get("/api/v1/proverbs", (request, response) => {
  response.status(200).json({
    status: "success",
    results: data.length,
    data
  });
});

server.listen(PORT, (err) => {

  if(err) return console.log(`Could not start server at port: ${PORT}`);
  console.log(`Running server at port: ${PORT}`);
});
