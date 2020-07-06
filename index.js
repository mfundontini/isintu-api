const express = require("express");

// Vars and configs
const server = express();
const PORT = 3000;

// Route handlers

server.listen(PORT, (err) => {

  if(err) return console.log(`Could not start server at port: ${PORT}`);
  console.log(`Running server at port: ${PORT}`);
});
