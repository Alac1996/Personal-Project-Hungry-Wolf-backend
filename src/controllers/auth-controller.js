const bcrypt = require("bcryptjs");
const prisma = require("../models/prisma");
const { registerSchema } = require("../validators/auth-validator");

exports.register = async (req, res, next) => {
  try {
    const { value, error } = registerSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    value.password = await bcrypt.hash(value.password, 11);
    console.log(value);
    const user = await prisma.user.create({
      data: value,
    });
    console.log(value);
  } catch (error) {
    next(error);
  }
};
