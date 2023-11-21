const prisma = require("../models/prisma");

exports.createOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const cartItems = await prisma.cart_Item.findMany({
      where: {
        userId,
      },
      include: {
        product: true,
      },
    });

    if (cartItems.length === 0) {
      return res
        .status(400)
        .json({ message: "cart is empty, cannot create an order" });
    }

    const totalAmount = cartItems.reduce((total, cartItem) => {
      const itemTotal = cartItem.quantity * cartItem.product.price;
      return total + itemTotal;
    }, 0);

    const createProductOrder = cartItems.map((cartItem) => ({
      productId: cartItem.productId,
      quantity: cartItem.quantity,
      price: cartItem.product.price,
    }));

    const order = await prisma.order.create({
      data: {
        userId,
        totalPrice: totalAmount,
        ProductOrder: {
          create: createProductOrder,
        },
      },
    });

    await prisma.cart_Item.deleteMany({
      where: {
        userId,
      },
    });
    res.status(200).json({ message: "Orders create successfully", order });
  } catch (error) {
    next(error);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const orders = await prisma.order.findMany({
      where: {
        userId,
      },
      include: {
        ProductOrder: {
          include: {
            product: true,
          },
        },
      },
    });
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};
