const express = require("express");

const authenticateMiddleware = require("../middlewares/authenticate");
const orderController = require("../controllers/order-controller");

const router = express.Router();

router.post(
  "/createOrder",
  authenticateMiddleware,
  orderController.createOrder
);

router.get("/getOrders", authenticateMiddleware, orderController.getOrders);

module.exports = router;
