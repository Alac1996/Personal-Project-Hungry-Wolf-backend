const Joi = require("joi");

const checkProductSchema = Joi.object({
  product_Name: Joi.string().trim().required(),
  description: Joi.string().trim().required(),
  price: Joi.number().required(),
  category: Joi.string().trim().required(),
  crust: Joi.string().trim(),
  size: Joi.string().trim(),
});

exports.checkProductSchema = checkProductSchema;
