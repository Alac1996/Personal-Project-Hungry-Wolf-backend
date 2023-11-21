const fs = require("fs/promises");
const prisma = require("../models/prisma");
const { upload } = require("../utils/cloudinary-service");

const { checkProductSchema } = require("../validators/product-validators");
const createError = require("../utils/create-error");

exports.createProduct = async (req, res, next) => {
  try {
    const { value, error } = checkProductSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    if (req.file) {
      value.image = await upload(req.file.path);
    }

    const product = await prisma.product.create({
      data: {
        product_Name: req.body.product_Name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        crust: req.body.crust,
        size: req.body.size,
        image: value.image,
      },
    });
    res.status(201).json({ message: "product created", product });
  } catch (error) {
    next(error);
  } finally {
    if (req.file) {
      fs.unlink(req.file.path);
    }
  }
};

exports.getProductByCat = async (req, res, next) => {
  try {
    const { category } = req.query;
    if (!category) {
      return res
        .status(400)
        .json({ message: "Category is required in the query parameters" });
    }
    if (category === "pizza") {
      const catProduct = await prisma.product.groupBy({
        where: {
          category,
          size: "Large",
          crust: "Thick_soft",
        },
        by: ["product_Name", "image", "category", "id"],
      });
      return res.status(200).json({ catProduct });
    }
    const catProduct = await prisma.product.findMany({
      where: {
        category,
      },
    });
    res.status(200).json({ catProduct });
  } catch (error) {
    next(error);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const productInfo = await prisma.product.findUnique({
      where: {
        id: +productId,
      },
    });
    res.status(200).json({ productInfo });
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const existProduct = await prisma.product.findFirst({
      where: {
        id: +productId,
      },
    });
    if (!existProduct) {
      return next(createError("product does not exist", 400));
    }

    await prisma.product.delete({
      where: {
        id: existProduct.id,
      },
    });
    res.status(200).json({ message: "The product has been deleted" });
  } catch (error) {
    next(error);
  }
};
