const mongoose = require("mongoose");

const server = require("./app");

const PORT = process.env.PORT;
const DB = process.env.DATABASE.replace("$PASSWORD", process.env.MONGO_PASSWORD);

// Connect to database
mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
}).then(connection => {

  console.log(`DATABASE connection to ${DB} successful`);

}).catch(err => {

  console.log(err.message);
  
});

// Run server at specified PORT
server.listen(PORT, (err) => {

    if(err) return console.log(`Could not start server at port: ${PORT}`);
    console.log(`Running server at port: ${PORT}`);
  });
  