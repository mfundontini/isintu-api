const express = require("express");

const {listAllProverbs, createProverb, getProverb, proverbStatistics, slugifyAll,
    updateProverb, deleteProverb, validateId, aliasTranslated, proverbsByTags
} = require("./../controllers/proverbsController");

const proverbsRouter = express.Router();

// Aliased routes
proverbsRouter.route("/translated").get(aliasTranslated, listAllProverbs);
proverbsRouter.route("/statistics").get(proverbStatistics);
proverbsRouter.route("/tags").get(proverbsByTags);

// Param middlewares
proverbsRouter.param("id", validateId);

// REST Routes
proverbsRouter.route("/").get(slugifyAll, listAllProverbs).post(createProverb);
proverbsRouter.route("/:id").get(getProverb).patch(updateProverb).delete(deleteProverb);

module.exports = proverbsRouter;