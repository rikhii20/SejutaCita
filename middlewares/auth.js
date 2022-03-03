const jwt = require("jsonwebtoken");
const User = require("../models/user");
const errorHandler = require("../utils/errorHandler");

module.exports = {
  isLogin: async (req, res, next) => {
    try {
      let token = req.header("Authorization");
      if (!token) {
        return res.status(401).json({
          status: "Unauthorized",
          message: "No token detected",
        });
      }
      token = token.replace("Bearer ", "");
      const decoded = jwt.verify(token, process.env.SECRET_TOKEN);

      const user = await User.findOne({ _id: decoded._id });
      if (!user) {
        return res.status(401).json({
          status: "Unauthorized",
          message: "User not found",
        });
      }
      req.user = {
        _id: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
      };
      next();
    } catch (error) {
      errorHandler(res, error);
    }
  },
  isAdmin: async (req, res, next) => {
    try {
      let token = req.header("Authorization");
      if (!token) {
        return res.status(401).json({
          status: "Unauthorized",
          message: "No token detected",
        });
      }
      token = token.replace("Bearer ", "");
      const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
      const user = await User.findOne({ _id: decoded._id });
      if (!user) {
        return res.status(401).json({
          status: "Unauthorized",
          message: "User not found",
        });
      }
      if (user.role != "admin") {
        return res.status(401).json({
          status: "Unauthorized",
          message: "You have no right to access this end point",
          result: {},
        });
      }
      req.user = {
        _id: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
      };
      next();
    } catch (error) {
      errorHandler(res, error);
    }
  },
};
