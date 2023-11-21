const Joi = require("joi");

const registerSchema = Joi.object({
  username: Joi.string().trim().required(),
  password: Joi.string()
    .pattern(/^[a-zA-Z0-9]{6,30}$/)
    .trim()
    .required(),
  confirmPassword: Joi.string()
    .valid(Joi.ref("password"))
    .trim()
    .required()
    .strip(),
  email: Joi.string().email().required(),
  phone_No: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required(),
  address: Joi.string().required(),
});

const loginSchema = Joi.object({
  username: Joi.string().trim().required(),
  password: Joi.string()
    .pattern(/^[a-zA-Z0-9]{6,30}$/)
    .trim()
    .required(),
});

exports.Schema = { registerSchema, loginSchema };
