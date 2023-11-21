const prisma = require("../models/prisma");

exports.createCartList = async (req, res, next) => {
  try {
    console.log("Request received. Request body:", req.body);

    const targetProduct = await prisma.product.findFirst({
      where: {
        product_Name: req.body.product_Name,
        ...(req.body.size && { size: req.body.size }),
        ...(req.body.crust && { crust: req.body.crust }),
      },
    });
    console.log("Found target product:", targetProduct);

    let cartItem;

    if (targetProduct) {
      const targetCart = await prisma.cart_Item.findFirst({
        where: {
          userId: req.user.id,
          productId: targetProduct.id,
        },
      });
      console.log("Found target cart:", targetCart);

      if (targetCart) {
        const newQuantity = req.body.quantity;

        cartItem = await prisma.cart_Item.update({
          where: {
            id: targetCart.id,
          },
          data: {
            quantity: newQuantity,
          },
        });
        console.log("Updated cart item:", cartItem);
      } else {
        cartItem = await prisma.cart_Item.create({
          data: {
            quantity: req.body.quantity,
            userId: req.user.id,
            productId: targetProduct.id,
          },
        });
        console.log("Created new cart item", cartItem);
      }
    } else {
      return res.status(400).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Cart has been updated", cartItem });
  } catch (error) {
    next(error);
  }
};

exports.getCartItem = async (req, res, next) => {
  try {
    const targetCartItem = await prisma.cart_Item.findMany({
      where: {
        userId: req.user.id,
      },
      select: {
        product: true,
        quantity: true,
      },
    });

    console.log("Target Cart Item:", targetCartItem);
    res.status(200).json({
      targetCartItem: targetCartItem.map((el) => ({
        quantity: el.quantity,
        product_Name: el.product.product_Name,
        size: el.product.size,
        crust: el.product.crust,
        price: el.product.price,
      })),
    });
  } catch (error) {
    next(error);
  }
};

exports.updateCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity === 0) {
      await prisma.cart_Item.delete({
        where: {
          userId: req.user.id,
          productId: +productId,
        },
      });
    } else {
      await prisma.cart_Item.update({
        where: {
          userId: req.user.id,
          productId: +productId,
        },
        data: {
          quantity: quantity,
        },
      });
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

exports.deleteCartItem = async (req, res, next) => {
  try {
    const targetProduct = await prisma.product.findFirst({
      where: {
        product_Name: req.query.product_Name,
        ...(req.query.size && { size: req.query.size }),
        ...(req.query.crust && { crust: req.query.crust }),
      },
    });
    const userId = req.user.id;

    const targetCart = await prisma.cart_Item.findFirst({
      where: {
        userId,
        productId: targetProduct.id,
      },
    });
    if (!targetCart) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    await prisma.cart_Item.delete({
      where: {
        id: +targetCart.id,
      },
    });

    res.status(200).json({ message: "Cart item deleted" });
  } catch (error) {
    next(error);
  }
};
