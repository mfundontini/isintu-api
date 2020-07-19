const slugify = require("slugify");

const Proverb = require("./../schemas/proverbs");
const MongoQuery = require("./../utils/query");
const APIError = require("./../utils/apiError");
const handleErrors = require("./../utils/handleErrors.js");

// Middlewares
exports.validateId = (request, response, next, value) => {
    if(value.length !== 24 ) return response.status(401).json({
        status: "Fail",
        message: `id url param "${value}" is invalid.`
    });
    next();
};

/* WAS IMPORTANT WITH MOCFK DATA< BUT MONGOOSE API GIVES DIRECT FUNCTIONS FOR DELETION AND UPDATING
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
*/

/* ONE TIME FUNCTION -> slugify all documents using middleware, need middleware called in the router for this to work.
exports.slugifyAll = async (request, response, next) => {

  let proverbs = await Proverb.find({});
  
  for(let proverb of proverbs) {
    console.log(`SLUGIFYING ${proverb.title}`);
    let toUpdate = proverb._id;
    await Proverb.findByIdAndUpdate(toUpdate, {slug: slugify(proverb.title, {lower: true, strict: true})}, {new: true, runValidators: true});
    console.log(`SLUGIFIED ${proverb.title}`);
  }
  next();
};
*/


// Route handlers
exports.listAllProverbs = handleErrors(async (request, response, next) => {

  // Declare query with all results
  let query = request.mongoQuery || new MongoQuery(Proverb.find(), request.query);

  // Filter + Sort + Project + paginate query
  query.filter().sort().project().paginate();

  // Resolve query
  const proverbs = await query.query;
  // Use status codes to communicate actions than an umbrella error
  if(proverbs.length > 0) {
      return response.status(200).json({
      
      status: "Success.",
      page: query.page,
      limit: query.limit,
      results: proverbs.length,
      proverbs
    });
  }

  next(new APIError("No proverbs available.", 204, "No content."));

});

exports.getProverb = handleErrors(async (request, response, next) => {

      const proverb = await Proverb.findById(request.params.id);

      if(proverb) {
        return response.status(200).json({
          status: "success",
          proverb
        });
      }

      next(new APIError(`Proverb ${request.params.id} not found.`, 404, "Not found."));
});

exports.updateProverb = async (request, response, next) => {

  try {
      const proverb = await Proverb.findByIdAndUpdate(request.params.id, request.body, {new: true, runValidators: true});
      if(!proverb) throw new Error("Not found");
      return response.status(201).json({
        status: "success",
        proverb
      });
  }
  catch(err) {
    return response.status(404).json({
      status: "Fail",
      message: err.message
    });
  }
};

exports.createProverb = async (request, response, next) => {
  // Get body from response
  let body = request.body;

  // Create new object, do not mutate incomiming one
  const newProverb = Object.assign({created: body.updated}, body);

  try {
    // Await instance creation and respond
    const proverb = await Proverb.create(newProverb);
    console.log("Successfully persisted data.");
    response.status(201).json({
      status: "Created",
      proverb: proverb
    });
  }
  catch(err) {
    return response.status(401).json({
      status: "Fail",
      error: err
    });
  }
};

exports.deleteProverb = async (request, response, next) => {
  
  try {
      const proverb = await Proverb.findByIdAndDelete(request.params.id);
      return response.status(204).json({
        status: "success",
        proverb
      });
  }
  catch(err) {
    return response.status(404).json({
      status: "Fail",
      message: "Not found"
    });
  }
};

exports.proverbStatistics = async (request, response) => {

  const statistics = await Proverb.aggregate([
    {
      $match: { translations: { $exists: true, $ne: [] } },
    },
    {
      $group: {
        _id: { $toUpper: "$type" },
        averageRating: { $avg: "$rating" },
        minminum: { $min: "$rating" },
        maximum: { $max: "$rating" },
        total: { $sum: 1 }
      }
    },
    {
      $sort: { averageRating: 1}
    }
  ]);

  return response.status(200).json({
    status: "Success",
    statistics
  });
};

exports.proverbsByTags = async (request, response) => {

  const tags = await Proverb.aggregate([
    {
      $unwind: "$tags"
    },
    {
      $match: { translations: { $exists: true, $ne: [] } },
    },
    {
      $group: {
        _id: { $toUpper: "$tags" },
        total: { $sum: 1 },
        proverbs: { $push: { $concat: ["$title", " - ", "$description"]} }
      }
    },
    {
      $sort: { rating: 1}
    }
  ]);

  return response.status(200).json({
    status: "Success",
    tags
  });
};



exports.aliasTranslated = (request, response, next) => {
  request.mongoQuery = new MongoQuery(Proverb.find({ translations: { $exists: true, $ne: [] } }), request.query);
  next();
};