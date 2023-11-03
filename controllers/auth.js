const { CrtlWraper, HttpError } = require("../helpers");
const { User } = require("../models/");

const register = async (req, res) => {
  const newUser = User.create(req.body);
  console.log();
  //   if (!newUser) {
  //     throw HttpError(409, "Email already use");
  //   }
  res.status(201).json(newUser);
};
const login = async (req, res) => {};

module.exports = {
  register: CrtlWraper(register),
  login: CrtlWraper(login),
};
