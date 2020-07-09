const express = require("express");

const {listAllProverbs, createProverb, getProverb, updateProverb, deleteProverb} = require("./../controllers/proverbsController");

const proverbsRouter = express.Router();

// Routes
proverbsRouter.route("/").get(listAllProverbs).post(createProverb);
proverbsRouter.route("/:id").get(getProverb).patch(updateProverb).delete(deleteProverb);

module.exports = proverbsRouter;