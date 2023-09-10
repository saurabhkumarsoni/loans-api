const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const User = require("../Models/User.model");
const { authSchema } = require("../helpers/validation_schema");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../helpers/jwt_helper");

module.exports = {
    register: async (req, res, next) => {
        try {
          const result = await authSchema.validateAsync(req.body);
          const doesExist = await User.findOne({ email: result.email });
          if (doesExist)
            throw createError.Conflict(`${result.email} is already been registered`);
      
          const user = new User(result);
          const savedUser = await user.save();
          const accessToken = await signAccessToken(savedUser.id);
          const refreshToken = await signRefreshToken(savedUser.id);
          res.send({ accessToken, refreshToken });
        } catch (error) {
          if (error.isJoi === true) error.status = 422;
          next(error);
        }
      },

      login: async (req, res, next) => {
        try {
          const result = await authSchema.validateAsync(req.body);
          console.log(result);
          const user = await User.findOne({ email: result.email });
          if (!user) throw createError.NotFound("User not registered");
      
          const isMatch = await user.isValidPassword(result.password);
          console.log("password match", isMatch);
          if (!isMatch) throw createError.Unauthorized("Username/password not valid");
      
          const accessToken = await signAccessToken(user.id);
          const refreshToken = await signRefreshToken(user.id);
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
          if (!refreshToken) throw createError.BadRequest();
          const userId = await verifyRefreshToken(refreshToken);
      
          const accessToken = await signAccessToken(userId);
          const refToken = await signRefreshToken(userId);
          res.send({accessToken, refToken });
        } catch (error) {
          next(error);
        }
      },

      logout: async (req, res, next) => {
        try {
            const {refreshToken} = req.body;
            if(!refreshToken) throw createError.BadRequest();
            const userId =  await verifyRefreshToken(refreshToken);
    
        } catch(error){
            next(error);
        }
    }
}