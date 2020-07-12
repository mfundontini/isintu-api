const express = require("express");

const {listAllProverbs, createProverb, getProverb, 
    updateProverb, deleteProverb, validateId, aliasTranslated
} = require("./../controllers/proverbsController");

const proverbsRouter = express.Router();

// Param middlewares
proverbsRouter.param("id", validateId);

// Aliased routes
proverbsRouter.route("/translated").get(aliasTranslated, listAllProverbs);

// REST Routes
proverbsRouter.route("/").get(listAllProverbs).post(createProverb);
proverbsRouter.route("/:id").get(getProverb).patch(updateProverb).delete(deleteProverb);

module.exports = proverbsRouter;