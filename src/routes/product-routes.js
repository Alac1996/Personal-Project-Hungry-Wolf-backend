const express = require("express");

const authenticateMiddleware = require("../middlewares/authenticate");
const uploadMiddleware = require("../middlewares/upload");
const productController = require("../controllers/product-controller");

const router = express.Router();

router.post(
  "/",
  authenticateMiddleware,
  uploadMiddleware.single("image"),
  productController.createProduct
);

router.get("/", authenticateMiddleware, productController.getProductByCat);

router.get(
  "/:productId",
  authenticateMiddleware,
  productController.getProductById
);

router.delete(
  "/:productId",
  authenticateMiddleware,
  productController.deleteProduct
);

module.exports = router;
