const JWT = require('jsonwebtoken')
const createError = require("http-errors");
const User = require("../Models/User.model");
const { authSchema, loginSchema, forgotPasswordSchema} = require("../helpers/validation_schema");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../helpers/jwt_helper");
const client = require("../helpers/init_redis");
const {sendEmail} = require('../Utils/email');
const crypto = require('crypto');

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
          console.log("error inside redis del", err.message);
          throw createError.InternalServerError();
        }
        console.log("redis value", val);
        res.sendStatus(204);
      });
    } catch (error) {
      next(error);
    }
  },

  forgotPassword: async (req, res, next) => {
    // 1. GET USER BASED ON POSTED EMAIL
    const result = await forgotPasswordSchema.validateAsync(req.body);
    console.log("results user", result);
    const user = await User.findOne({ email: result.email });
    if (!user) throw createError.NotFound("User not registered");

    // 2. GENERATE RANDOM RESET TOKEN
    const resetToken = await user.createResetPasswordToken();
    console.log('resetToken', resetToken)
    await user.save({ validateBeforeSave: false });

    // 3. SEND THE TOKEN BACK TO THE USER EMAIL
    const resetUrl = `${req.protocol}://${req.get('host')}/users/resetPassword/${resetToken}`
    const message = `We have received a password reset request. Please use below link to reset your password`
    const username = user.email.split('@')[0]
    try {
      await sendEmail({
        email: user.email,
        subject: 'Password change request received',
        
        html: `<h3>Dear ${username},</h3> <p>${message}</p> <p>Password reset link <a href="${resetUrl}">${resetUrl}</a></p> <br/><b>This reset password link only valid for 10 min.</b><p>Thanks <br/>Epam Support team</p>`,
        message: message,
      });
      res.status(200).json({
        status: 'success',
        message: 'Password reset link send to user email'
      })
    } catch(error){
      user.passwordResetToken = undefined;
      user.passwordResetTokenExpires = undefined;
      user.save({validateBeforeSave: false})
      next(error);
    }
   
  },

  resetPassword: async (req, res, next) => {
    try {
      // 1. IF THE USER EXISTS WITH THE GIVEN TOKEN AND TOKEN HAS NOT EXPIRED
      const token = crypto.createHash('sha256').update(req.params.token).digest('hex');
      const user = await User.findOne({ passwordResetToken: token, passwordResetTokenExpires: { $gt: Date.now() } });
  
      if (!user) {
        const error = new Error('Token is invalid or has expired');
        error.statusCode = 400; // Set an appropriate status code
        throw error;
      }
  
      // 2. RESET THE USER PASSWORD
      user.password = req.body.password;
      user.confirmPassword = req.body.confirmPassword;
      user.passwordResetToken = undefined;
      user.passwordResetTokenExpires = undefined;
      user.passwordChangeAt = Date.now();
  
      // Save the user and handle errors
      await user.save();
  
      // 3. LOGIN THE USER

      const accessToken = await signAccessToken(user.id, user.role);
      const refreshToken = await signRefreshToken(user.id, user.role);

      res.status(200).json({
        status: 'success',
        accessToken,
        refreshToken
      })
    } catch (error) {
      next(error); // Forward the error to the error handling middleware
    }
  },
  
};
