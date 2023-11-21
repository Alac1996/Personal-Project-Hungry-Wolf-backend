const prisma = require("../models/prisma");

exports.createPayment = async (req, res, next) => {
  try {
    const { type, orderId } = req.body;
    const payment = await prisma.payment.create({
      data: {
        type,
        orderId,
      },
    });
    res.status(201).json(payment);
  } catch (error) {
    next(error);
  }
};

exports.getPaymentByOrderId = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const payments = await prisma.payment.findMany({
      where: {
        orderId: +orderId,
      },
    });
    res.status(200).json(payments);
  } catch (error) {
    next(error);
  }
};

// exports.updatePayment = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const { type } = req.body;
//     const updatePayment = await prisma.payment.update({
//       where: {
//         id: +id,
//       },
//       data: {
//         type,
//       },
//     });
//     res.status(200).json(updatePayment);
//   } catch (error) {
//     next(error);
//   }
// };
