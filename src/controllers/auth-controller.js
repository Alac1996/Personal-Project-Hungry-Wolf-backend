const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../models/prisma");
const { Schema } = require("../validators/auth-validator");
const createError = require("../utils/create-error");

exports.register = async (req, res, next) => {
  try {
    const { value, error } = Schema.registerSchema.validate(req.body);
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
    res
      .status(201)
      .json({ message: "Registration Successfully", accessToken, user });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { value, error } = Schema.loginSchema.validate(req.body);
    console.log(value);
    if (error) {
      return next(error);
    }
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username: value.username }],
      },
    });
    console.log(user);
    if (!user) {
      return next(createError("Invalid credential", 400));
    }
    const isMatch = await bcrypt.compare(value.password, user.password);
    if (!isMatch) {
      return next(createError("Invalid credential", 400));
    }
    const payload = { userId: user.id };
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY || "zxcvbnmasdfghjklqwertyuio",
      { expiresIn: process.env.JWT_EXPIRE }
    );
    delete user.password;
    res.status(201).json({ message: "Login Successfully", accessToken, user });
  } catch (error) {
    next(error);
  }
};

exports.getMe = (req, res) => {
  res.status(200).json({ user: req.user });
};

exports.updateUser = async (req, res, next) => {
  try {
    const userId = +req.params.id;
    const { phone_No, address } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        phone_No,
        address,
      },
    });

    res
      .status(200)
      .json({ message: "User data updated successfully", user: updatedUser });
  } catch (error) {
    next(error);
  }
};
