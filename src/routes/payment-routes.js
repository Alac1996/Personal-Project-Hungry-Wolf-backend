const express = require("express");

const authenticateMiddleware = require("../middlewares/authenticate");
const uploadMiddleware = require("../middlewares/upload");
const paymentController = require("../controllers/payment-controller");

const router = express.Router();

router.post(
  "/createPayment",
  authenticateMiddleware,
  uploadMiddleware.single("image"),
  paymentController.createPayment
);

router.get(
  "/payments/:orderId",
  authenticateMiddleware,
  paymentController.getPaymentByOrderId
);

// router.put(
//   "/payments/:id",
//   authenticateMiddleware,
//   paymentController.updatePayment
// );

module.exports = router;
