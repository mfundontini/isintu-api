const filesystem = require("fs");

const Proverb = require("./../schemas/proverbs");

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


exports.findProverbOrExit = (request, response, next) => {
    // Get id from url
    let id = request.params.id * 1;
    const body = request.body;

    let index = data.findIndex(element => element.id === id);
    // console.log(id, index, data[index]);

    if(index === -1) return response.status(404).json({
        status: "Fail",
        message: "Not found"
    });
    request.index = index;
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

  const body = request.body;
  // JS noobity
  let updatedProverb = Object.assign(data[request.index], body);

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

  // Create new object, do not mutate incomiming one
  const newProverb = Object.assign({created: body.updated}, body);

  // Persist data
  const proverb = new Proverb(newProverb);
  proverb.save().then(result => {
    console.log("Successfully persisted data.");
    response.status(201).json({
      status: "Created",
      proverb: result
    });
  }).catch(err => {
    return response.status(401).json({
      status: "Fail",
      error: err
    });
  });
};

exports.deleteProverb = (request, response) => {
  
  data.splice(request.index, 1);

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