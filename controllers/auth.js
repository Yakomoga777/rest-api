const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const fs = require("fs/promises");
const path = require("path");
const Jimp = require("jimp");

const { CtrlWraper, HttpError } = require("../helpers");
const { User } = require("../models/");
const { schema } = require("../helpers");
const { SECRET_KEY } = process.env;

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res) => {
  const { error } = schema.registationSchema.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }

  const { email, password } = req.body;
  const isEmail = await User.findOne({ email });

  if (isEmail) {
    throw HttpError(409, "A user with this email already exists 1 🤔🤷‍♂️");
  }
  const hashPassword = await bcrypt.hash(password, 10);

  const avatarURL = gravatar.url("email");

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
  });

  res.status(201).json({
    email: newUser.email,
    subscription: newUser.subscription,
  });
};
const login = async (req, res) => {
  const { error } = schema.loginSchema.validate(req.body);
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
  const { error } = schema.subscriptionValidation.validate(req.body);
  if (error) {
    console.log(error.message);
    throw HttpError(400, error.message);
  }

  const { subscription } = req.body;
  console.log(subscription);

  const { id } = req.user;

  const result = await User.findByIdAndUpdate(
    id,
    { subscription },
    { new: true }
  );
  console.log(result);

  res.json(result);
};

const updateAvatar = async (req, res) => {
  const { path: tempUpload, originalname } = req.file;
  const { _id: id } = req.user;

  const fileName = `${id}_${originalname}`;
  const resultName = path.join(avatarsDir, fileName);
  await fs.rename(tempUpload, resultName);

  const avatarURL = path.join("avatars", fileName);
  console.log("avatarURL", avatarURL);

  await User.findByIdAndUpdate(id, { avatarURL });

  Jimp.read(fileName, (err, lenna) => {
    if (err) throw err;
    lenna
      .resize(250, 250) // resize
      .write(`${resultName}-small-avatar.png`); // save
  });

  res.json({ avatarURL });
};

module.exports = {
  register: CtrlWraper(register),
  login: CtrlWraper(login),
  current: CtrlWraper(current),
  logout: CtrlWraper(logout),
  updateSubscription: CtrlWraper(updateSubscription),
  updateAvatar: CtrlWraper(updateAvatar),
};
