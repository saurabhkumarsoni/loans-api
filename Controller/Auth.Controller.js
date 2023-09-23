const JWT = require('jsonwebtoken')
const createError = require("http-errors");
const User = require("../Models/User.model");
const { authSchema, loginSchema } = require("../helpers/validation_schema");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../helpers/jwt_helper");
const client = require("../helpers/init_redis");

module.exports = {
  register: async (req, res, next) => {
    try {
      const result = await authSchema.validateAsync(req.body);
      const doesExist = await User.findOne({ email: result.email });
      if (doesExist)
        throw createError.Conflict(
          `${result.email} is already been registered`
        );

      const user = new User(result);
      const savedUser = await user.save();
      const accessToken = await signAccessToken(savedUser.id, savedUser.role);
      const refreshToken = await signRefreshToken(savedUser.id, savedUser.role);
    
      res.send({ accessToken, refreshToken });
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  },

  login: async (req, res, next) => {
    try {
      const result = await loginSchema.validateAsync(req.body);
      console.log(result);
      const user = await User.findOne({ email: result.email });
      if (!user) throw createError.NotFound("User not registered");

      const isMatch = await user.isValidPassword(result.password);
      console.log("password match", isMatch);
      if (!isMatch)
        throw createError.Unauthorized("Username/password not valid");

      const accessToken = await signAccessToken(user.id, user.role);
      const refreshToken = await signRefreshToken(user.id, user.role);
      res.send({ accessToken, refreshToken });
    } catch (error) {
      if (error.isJoi)
        return next(createError.BadRequest("Invalid Username/Password"));
      next(error);
    }
  },

  refreshToken: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      console.log("Received refreshToken:", refreshToken);
      const userRole = JWT.decode(refreshToken).role;
      if (!refreshToken) throw createError.BadRequest();
      const userId = await verifyRefreshToken(refreshToken, userRole);

      const accessToken = await signAccessToken(userId, userRole);
      const refToken = await signRefreshToken(userId, userRole);
      res.send({ accessToken, refToken });
    } catch (error) {
      next(error);
    }
  },

  logout: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      const userRole = JWT.decode(refreshToken).role;
      if (!refreshToken) throw createError.BadRequest();
      const userId = await verifyRefreshToken(refreshToken, userRole);
      client.DEL(userId, (err, val) => {
        if (err) {
          console.log('error inside redis del',err.message);
          throw createError.InternalServerError();
        }
        console.log('redis value',val);
        res.sendStatus(204);
      });
    } catch (error) {
      next(error);
    }
  },
};
