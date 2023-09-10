const JWT = require("jsonwebtoken");
const createError = require("http-errors");

module.exports = {
  signAccessToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = {};
      const secret = process.env.ACCESS_TOKEN_SECRET;
      const option = {
        expiresIn: "1y",
        issuer: "google.com",
        audience: userId,
      };
      JWT.sign(payload, secret, option, async (error, token) => {
        if (error) {
          console.log(error);
          // reject(error);
          reject(createError.InternalServerError());
        }
        resolve(token);
      });
    });
  },

  verifyAccessToken: (req, res, next) => {
    if (!req.headers["authorization"]) return next(createError.Unauthorized());
    const authHeader = req.headers["authorization"];
    const bearerToken = authHeader.split(" ");
    const token = bearerToken[1];
    JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, payload) => {
      console.log("Error:",error)
      if(error!=null){
        const message = error.name === "JsonWebTokenError" ? "Unauthorized" : error.message;
        return next(createError.Unauthorized(message));
      }
      req.payload = payload;
      next();
    });
  },

  signRefreshToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = {};
      const secret = process.env.REFRESH_TOKEN_SECRET;
      const option = {
        expiresIn: "1y",
        issuer: "google.com",
        audience: userId,
      };
      JWT.sign(payload, secret, option, async (error, token) => {
        if (error) {
          console.log(error);
          reject(createError.InternalServerError());
        }
        resolve(token);
      });
    });
  },
  
  verifyRefreshToken: (refreshToken) => {
    console.log('refreshToken:', refreshToken);
  
    return new Promise((resolve, reject) => {
      JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, payload) => {
        if (error) {
          console.error('JWT verification failed:', error);
          // You can customize the error response as needed.
          reject(createError.Unauthorized('Invalid refresh token'));
        } else {
          const userId = payload.aud;
          resolve(userId);
        }
      });
    });
  },
  
};
