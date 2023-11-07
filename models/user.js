const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");
const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    match: emailRegexp,
    unique: true,
  },
  password: {
    type: String,
    require: true,
    min: 6,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  token: {
    type: String,
    default: "",
  },
});

userSchema.post("save", handleMongooseError);

const User = model("user", userSchema);

module.exports = { User };
