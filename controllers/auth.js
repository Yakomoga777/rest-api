const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { CtrlWraper, HttpError } = require("../helpers");
const { User } = require("../models/");
const { userSchema } = require("../helpers");
const { SECRET_KEY } = process.env;

const register = async (req, res) => {
  const { error } = userSchema.registationSchema.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }

  const { email, password } = req.body;
  const isEmail = await User.findOne({ email });

  if (isEmail) {
    throw HttpError(409, "A user with this email already exists 1 🤔🤷‍♂️");
  }
  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ ...req.body, password: hashPassword });

  res.status(201).json({
    email: newUser.email,
    subscription: newUser.subscription,
  });
};
const login = async (req, res) => {
  const { error } = userSchema.loginSchema.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, "Email or password is wrong 😕");
  }

  const comparePassword = await bcrypt.compare(password, user.password);
  if (!comparePassword) {
    throw HttpError(401, "Email or password is wrong 😕");
  }
  const payload = { id: user._id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

  console.log(`payload = ${payload.id}`);
  console.log(user._id);

  await User.findByIdAndUpdate(payload.id, {
    token,
  });

  res.json({
    token,
    user: {
      email,
      subscription: user.subscription,
    },
  });
};

const current = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
};

const logout = async (req, res) => {
  const { id } = req.user;

  await User.findByIdAndUpdate(id, { token: "" });

  res.status(204).json({ message: "No Content" });
};

const updateSubscription = async (req, res) => {
  console.log("updateSubscription");

  const { subscription } = req.body;
  console.log(subscription);

  const { id } = req.user;

  const result = await User.findByIdAndUpdate(id, req.body, { new: true });
  console.log(result);

  res.json(result);
};

module.exports = {
  register: CtrlWraper(register),
  login: CtrlWraper(login),
  current: CtrlWraper(current),
  logout: CtrlWraper(logout),
  updateSubscription: CtrlWraper(updateSubscription),
};
