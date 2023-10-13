const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const prisma = require("../models/prisma");
const { Schema } = require("../validators/auth-validator");
const error = require("../middlewares/error");

exports.register = async (req, res, next) => {
  try {
    const { value, error } = Schema.registerSchema.validate(req.body);
    Schema.registerSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    value.password = await bcrypt.hash(value.password, 11);
    const user = await prisma.user.create({
      data: value,
    });
    const payload = { userId: user.id };
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY || "zxcvbnmasdfghjklqwertyuio",
      { expiresIn: process.env.JWT_EXPIRE }
    );
    delete user.password;
    res.status(201).json({ message: "Registration Successfully", accessToken });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { value, error } = Schema.loginSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    let user;
    if (!user) {
      res.status(400).json({ message: "Invalid Credential" });
    }
    user = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid Credential" });
    }
    const payload = { userId: user.id };
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY || "zxcvbnmasdfghjklqwertyuio",
      { expiresIn: process.env.JWT_EXPIRE }
    );
    res.status(201).json({ message: "Login Successfully", accessToken });
  } catch (error) {
    next(error);
  }
};
