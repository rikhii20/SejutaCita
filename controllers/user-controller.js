const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const errorHandler = require("../utils/errorHandler");
const User = require("../models/user");

module.exports = {
  createAccount: async (req, res) => {
    const { name, username, password, role } = req.body;
    try {
      const schema = Joi.object({
        name: Joi.string().required(),
        username: Joi.string().min(4).required(),
        password: Joi.string().min(5).required(),
        role: Joi.string().required(),
      });
      const { error } = schema.validate({
        name,
        username,
        password,
        role,
      });
      if (error) {
        return res.status(400).json({
          status: "Bad request",
          message: error.message,
          result: {},
        });
      }
      const check = await User.findOne({ username });
      if (check) {
        return res.status(400).json({
          status: "Bad request",
          message: "Username has already exist",
          result: {},
        });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        name,
        username,
        password: hashedPassword,
        role,
      });
      const token = jwt.sign(
        {
          _id: user.id,
          username: user.username,
        },
        process.env.SECRET_TOKEN,
        { expiresIn: "24h" },
      );
      res.status(200).json({
        status: "Success",
        message: "Successfuly to register",
        result: {
          token,
        },
      });
    } catch (error) {
      errorHandler(res, error);
    }
  },
  getUser: async (req, res) => {
    try {
      const user = await User.findOne(
        { _id: req.user._id },
        { password: 0, createdAt: 0 },
      );
      if (!user) {
        return res.status(404).json({
          status: "Not Found",
          message: "User not found",
          result: {},
        });
      }
      res.status(200).json({
        status: "Success",
        message: "Successfully",
        result: user,
      });
    } catch (error) {
      errorHandler(res, error);
    }
  },
  getUsers: async (req, res) => {
    try {
      const user = await User.find();
      if (user.length == 0) {
        return res.status(404).json({
          status: "Not Found",
          message: "The data is empty",
          result: [],
        });
      }
      res.status(200).json({
        status: "Success",
        message: "Successfully retrieve the data",
        result: user,
      });
    } catch (error) {
      errorHandler(res, error);
    }
  },
  editUser: async (req, res) => {
    const { name, username, role } = req.body;
    const { userId } = req.query;
    try {
      const schema = Joi.object({
        name: Joi.string(),
        username: Joi.string().min(4),
        role: Joi.string(),
      });
      const { error } = schema.validate({
        name,
        username,
        role,
      });
      if (error) {
        return res.status(400).json({
          status: "Bad request",
          message: error.message,
          result: {},
        });
      }
      const update = await User.findByIdAndUpdate(
        { _id: userId },
        { name, username, role },
        { new: true },
      );
      if (!update) {
        return res.status(404).json({
          status: "Not Found",
          message: "Data not found",
          result: {},
        });
      }
      res.status(200).json({
        status: "Success",
        message: "Successfully update the data",
        result: update,
      });
    } catch (error) {
      errorHandler(res, error);
    }
  },
  deleteUser: async (req, res) => {
    try {
      const { userId } = req.query;
      const user = await User.findOneAndDelete({
        _id: userId,
      });
      if (!user) {
        return res.status(404).json({
          status: "Not Found",
          message: "Data not found",
          result: {},
        });
      }
      res.status(200).json({
        status: "Success",
        message: "Successfully delete the data",
        result: user,
      });
    } catch (error) {
      errorHandler(res, error);
    }
  },
};
