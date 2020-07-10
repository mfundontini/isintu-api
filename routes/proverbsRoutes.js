const express = require("express");

const {listAllProverbs, createProverb, getProverb, 
    updateProverb, deleteProverb, validateId, findProverbOrExit
} = require("./../controllers/proverbsController");

const proverbsRouter = express.Router();

// Param middlewares
proverbsRouter.param("id", validateId);

// Routes
proverbsRouter.route("/").get(listAllProverbs).post(createProverb);
proverbsRouter.route("/:id").get(getProverb).patch(findProverbOrExit, updateProverb).delete(findProverbOrExit, deleteProverb);

module.exports = proverbsRouter;