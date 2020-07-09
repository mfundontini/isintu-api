// Core imports
const filesystem = require("fs");

// Third party imports
const express = require("express");
const morgan = require("morgan");
const { request, response } = require("express");

// Vars and configs
const data = JSON.parse(filesystem.readFileSync(`${__dirname}/data/database.json`));
const server = express();
const PORT = 3000;

// Server config and middlewares
server.use(morgan('dev'));
server.use(express.json());

server.use((request, response, next) => {
  if(request.method == "POST"){
    if(Object.keys(request.body).length === 0) {
      console.log("Empty post data");
      return response.status(401).json({
        status: "Fail",
        message: "Empty body supplied."
      });
    }
    else request.body.updated = new Date().toISOString();
  }
  next();
});

// Route handlers
const listAllProverbs = (request, response) => {
  response.status(200).json({
    status: "success",
    results: data.length,
    data
  });
};


// Route handlers
const getProverb = (request, response) => {
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
};

const updateProverb = (request, response) => {
  // Get id from url
  let id = request.params.id * 1;
  const body = request.body;

  let index = data.findIndex(element => element.id === id);
  console.log(id, index, data[index]);

  if(index === -1) return response.status(404).json({
    status: "Fail",
    message: "Not found"
  });

  // JS noobity
  let updatedProverb = Object.assign(data[index], body);

  // Persist data
  filesystem.writeFile(`${__dirname}/data/database.json`, JSON.stringify(data), err => {
    if(err) return response.status(500).json({
      status: "Fail",
      message: "Updated proverb not saved"
    });
  });

  response.status(200).json({
    status: "success",
    proverb: updatedProverb
  });
};

const createProverb = (request, response) => {
  // Get body from response
  let body = request.body;

  console.log(body);

  // Massage the data
  let newId = data[data.length - 1].id + 1;

  // Create new object, do not mutate incomiming one
  const newProverb = Object.assign({id: newId}, body);
  data.push(newProverb);

  // Persist data
  filesystem.writeFile(`${__dirname}/data/database.json`, JSON.stringify(data), err => {
    if(err) return response.status(500).json({
      status: "Fail",
      message: "New proverb not saved"
    });
  });

  // If all went well return a 201
  response.status(201).json({
    status: "Created",
    proverb: newProverb
  });
};

const deleteProverb = (request, response) => {
  // Get id from url
  let id = request.params.id * 1;

  let index = data.findIndex(element => element.id === id);
  console.log(id, index, data[index]);

  if(index === -1) return response.status(404).json({
    status: "Fail",
    message: "Not found"
  });
  
  data.splice(index, 1);

  // Persist data
  filesystem.writeFile(`${__dirname}/data/database.json`, JSON.stringify(data), err => {
    if(err) return response.status(500).json({
      status: "Fail",
      message: "Proverb not deleted."
    });
  });

  response.status(204).json({
    status: "success"
  });
};

const listAllUsers = (request, response) => {
  response.status(501).json({
    status: "Fail",
    message: "Not implemented"
  });
};

const getUser = (request, response) => {
  response.status(501).json({
    status: "Fail",
    message: "Not implemented"
  });
};

const updateUser = (request, response) => {
  response.status(501).json({
    status: "Fail",
    message: "Not implemented"
  });
};

const createUser = (request, response) => {
  response.status(501).json({
    status: "Fail",
    message: "Not implemented"
  });
};

const deleteUser = (request, response) => {
  response.status(501).json({
    status: "Fail",
    message: "Not implemented"
  });
};

// Routes
server.route("/api/v1/proverbs").get(listAllProverbs).post(createProverb);
server.route("/api/v1/proverbs/:id").get(getProverb).patch(updateProverb).delete(deleteProverb);
server.route("/api/v1/users").get(listAllUsers).post(createUser);
server.route("/api/v1/users/:id").get(getUser).patch(updateUser).delete(deleteUser);

// Run server
server.listen(PORT, (err) => {

  if(err) return console.log(`Could not start server at port: ${PORT}`);
  console.log(`Running server at port: ${PORT}`);
});
