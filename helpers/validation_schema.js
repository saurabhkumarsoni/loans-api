const Joi = require("@hapi/joi");
const { roles } = require("../helpers/constant");

const authSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(3).max(15).required().label("Password"),
  confirmPassword: Joi.any()
    .equal(Joi.ref("password"))
    .required()
    .label("Confirm password")
    .options({ messages: { "any.only": "{{#label}} does not match" } }),
  photo: Joi.string(),
  role: Joi.string(),
  role: {
    type: String,
    enum: [roles.admin, roles.moderator, roles.client, roles.user],
    default: roles.user,
  },
});

const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(3).max(15).required().label("Password"),
})

module.exports = {
  authSchema,
  loginSchema
};
