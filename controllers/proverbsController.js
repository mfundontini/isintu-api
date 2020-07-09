const filesystem = require("fs");

const data = JSON.parse(filesystem.readFileSync(`${__dirname}/../data/database.json`));

exports.listAllProverbs = (request, response) => {
  response.status(200).json({
    status: "success",
    results: data.length,
    data
  });
};

exports.validateId = (request, response, next, value) => {
    if(!Number.isInteger(value * 1)) return response.status(401).json({
        status: "Fail",
        message: `id url param "${value}" must be a number.`
    });
    next();
};

// Route handlers
exports.getProverb = (request, response) => {
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

exports.updateProverb = (request, response) => {
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
  filesystem.writeFile(`${__dirname}/../data/database.json`, JSON.stringify(data), err => {
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

exports.createProverb = (request, response) => {
  // Get body from response
  let body = request.body;

  console.log(body);

  // Massage the data
  let newId = data[data.length - 1].id + 1;

  // Create new object, do not mutate incomiming one
  const newProverb = Object.assign({id: newId}, body);
  data.push(newProverb);

  // Persist data
  filesystem.writeFile(`${__dirname}/../data/database.json`, JSON.stringify(data), err => {
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

exports.deleteProverb = (request, response) => {
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
  filesystem.writeFile(`${__dirname}/../data/database.json`, JSON.stringify(data), err => {
    if(err) return response.status(500).json({
      status: "Fail",
      message: "Proverb not deleted."
    });
  });

  response.status(204).json({
    status: "success"
  });
};