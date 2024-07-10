import {databaseManager} from "@/db";
import {ValidationError} from "@/lib/errors";

export const createOrder = async (
  userId: number,
  orderInfo: Array<{productId: number; quantity: number}>,
) => {
  const prisma = databaseManager.getInstance();
  const orderId = prisma.$transaction(async tx => {
    const order = await tx.order.create({
      data: {
        userId: userId,
      },
    });
    for (const {productId, quantity} of orderInfo) {
      const product = await tx.product.findUniqueOrThrow({
        where: {
          id: productId,
        },
      });
      await tx.orderDetail.create({
        data: {
          orderId: order.id,
          productId,
          price: product.price,
          quantity,
        },
      });
      const stock = await tx.stock.update({
        where: {
          id: product.stockId,
        },
        data: {
          quantity: {
            decrement: quantity,
          },
        },
      });
      if (stock.quantity < 0) {
        throw new ValidationError([`${product.name} is out of stock`]);
      }
    }
    return order.id;
  });

  return orderId;
};

export const getOrder = async (orderId: number) => {
  const prisma = databaseManager.getInstance();
  return await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      orderDetails: {
        include: {
          product: true,
        },
      },
    },
  });
};

export const getOrders = async (userId: number) => {
  const prisma = databaseManager.getInstance();
  return await prisma.order.findMany({
    where: {
      userId: userId,
    },
    include: {
      orderDetails: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};
