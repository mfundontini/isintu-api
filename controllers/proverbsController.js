const Proverb = require("./../schemas/proverbs");

// Constants
const FILTERING_EXCLUSIONS = ["limit", "offset", "sort", "order", "fields", "page"];

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

// Route handlers
exports.listAllProverbs = async (request, response) => {

  try {
    // Declare query with all results
    let query = Proverb.find();

    // Filtering
    const queryString = request.query;
    if(Object.keys(queryString).length !== 0) {
      console.log(queryString);
      let filters = {...queryString};

      FILTERING_EXCLUSIONS.forEach(el => delete filters[el]);

      query.find(filters);  
    }

    // Sorting
    if(queryString.sort) {
      const sortBy = queryString.sort.replace(",", " ");
      query.sort(sortBy);
    }

    // Projection
    if(queryString.fields) {
      const fields = queryString.fields.split(",").join(" ");
      console.log(fields);
      query.select(fields);
    }
    else {
      query.select("-__v");
    }

    // Pagination
    const page = queryString.page * 1 || 1;
    const limit = queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;

    if(page > 1) {
      const numberOfProverbs = await Proverb.countDocuments();
      if (skip >= numberOfProverbs) throw new Error("Page out of range.");
    }
    
    query.skip(skip).limit(limit);

    // Resolve query
    const proverbs = await query;
    // Use status codes to communicate actions than an umbrella error
    if(proverbs.length > 0) {
       return response.status(200).json({
        
        status: "Success",
        page: page,
        limit: limit,
        results: proverbs.length,
        proverbs
      });
    }
    return response.status(204).json({
      status: "No content",
      results: 0,
      page: queryString.page,
      limit: queryString.limit,
      data: [] 
    });
  }
  catch(err) {
    return response.status(500).json({
      status: "Fail",
      error: err.message 
    });
  }
};

exports.getProverb = async (request, response) => {
  
  try {
      const proverb = await Proverb.findById(request.params.id);
      return response.status(200).json({
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

exports.updateProverb = async (request, response) => {

  try {
      const proverb = await Proverb.findByIdAndUpdate(request.params.id, request.body, {new: true, runValidators: true});
      return response.status(201).json({
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

exports.createProverb = async (request, response) => {
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

exports.deleteProverb = async (request, response) => {
  
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