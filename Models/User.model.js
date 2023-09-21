const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const Joi = require("@hapi/joi");
const { roles } = require("../helpers/constant");

const UserSchema = new Schema({
  name: Joi.string().required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(3).max(15).required().label("Password"),
  confirmPassword: Joi.any()
    .equal(Joi.ref("password"))
    .required()
    .label("Confirm password")
    .options({ messages: { "any.only": "{{#label}} does not match" } }),
  photo: Joi.string(),
  role: {
    type: String,
    enum: [roles.admin, roles.moderator, roles.client, roles.user],
    default: roles.user,
  }
});

UserSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;

    this.confirmPassword = undefined;
    if (this.email === process.env.ADMIN_EMAIL.toLowerCase()) {
      this.role = roles.admin;
    }
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    next(error);
  }
};

const User = mongoose.model("user", UserSchema);
module.exports = User;
