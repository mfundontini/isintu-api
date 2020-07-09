const server = require("./app");

const PORT = 3000;

// Run server at specified PORT
server.listen(PORT, (err) => {

    if(err) return console.log(`Could not start server at port: ${PORT}`);
    console.log(`Running server at port: ${PORT}`);
  });
  