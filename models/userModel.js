const { Schema, model } = require("mongoose");

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    match: emailRegexp,
    unique: true,
  },
  password: {
    type: String,
    require: true,
    min: 6,
  },
});

const User = model("user", userSchema);

module.exports = { User };
