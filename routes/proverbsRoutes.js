const express = require("express");

const {listAllProverbs, createProverb, getProverb, proverbStatistics,
    updateProverb, deleteProverb, validateId, aliasTranslated
} = require("./../controllers/proverbsController");

const proverbsRouter = express.Router();

// Aliased routes
proverbsRouter.route("/translated").get(aliasTranslated, listAllProverbs);
proverbsRouter.route("/statistics").get(proverbStatistics);

// Param middlewares
proverbsRouter.param("id", validateId);

// REST Routes
proverbsRouter.route("/").get(listAllProverbs).post(createProverb);
proverbsRouter.route("/:id").get(getProverb).patch(updateProverb).delete(deleteProverb);

module.exports = proverbsRouter;