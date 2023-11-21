const express = require("express");

const authenticateMiddleware = require("../middlewares/authenticate");
const cartController = require("../controllers/cart-controller");

const router = express.Router();

router.post(
  "/createCart",
  authenticateMiddleware,
  cartController.createCartList
);

router.get("/getCartItem", authenticateMiddleware, cartController.getCartItem);

router.put(
  "/updateCartItem/:productId",
  authenticateMiddleware,
  cartController.updateCartItem
);

router.delete(
  "/deleteCartItem",
  authenticateMiddleware,
  cartController.deleteCartItem
);

module.exports = router;
