const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const User = require("../models/user");
const errorHandler = require("../utils/errorHandler");

module.exports = {
  login: async (req, res) => {
    const { username, password } = req.body;
    try {
      const schema = Joi.object({
        username: Joi.string().min(4).required(),
        password: Joi.string().required(),
      });
      const { error } = schema.validate({
        username,
        password,
      });
      if (error) {
        return res.status(400).json({
          status: "Bad request",
          message: error.message,
          result: {},
        });
      }
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({
          status: "Unauthorized",
          message: "Invalid username or password",
          result: {},
        });
      }
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({
          status: "Unauthorized",
          message: "Invalid username or password",
          result: {},
        });
      }
      const token = jwt.sign(
        {
          username: user.username,
          _id: user.id,
        },
        process.env.SECRET_TOKEN,
        { expiresIn: "24h" },
      );
      res.status(200).json({
        status: "Success",
        message: "Logged in successfuly",
        result: {
          token,
          user: {
            _id: user.id,
            name: user.name,
            username: user.username,
            role: user.role,
          },
        },
      });
    } catch (error) {
      errorHandler(res, error);
    }
  },
};
