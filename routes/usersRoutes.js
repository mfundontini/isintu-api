const express = require("express");

const {listAllUsers, createUser, getUser, updateUser, deleteUser} = require("./../controllers/usersController");

const usersRouter = express.Router();

usersRouter.route("/").get(listAllUsers).post(createUser);
usersRouter.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = usersRouter;