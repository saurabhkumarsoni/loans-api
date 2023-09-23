const createError = require("http-errors");

const checkUserRole = (role) => {
  return async (req, res, next) => {
    try {
      console.log("Checking user role middleware");
      const authHeader = req.headers["authorization"];
      console.log("Authorization header:", authHeader);
      if (!authHeader) {
        return next(createError.Unauthorized());
      }

      const token = authHeader.split(" ")[1];
      if (!token) {
        return next(createError.Unauthorized());
      }

      const payload = req.payload;
      console.log("payload", payload);
      if (!payload) {
        return next(createError.Unauthorized());
      }

      req.payload = payload;
      if (req.payload.role !== role) {
        return next(createError.Forbidden("Access denied"));
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = checkUserRole;
