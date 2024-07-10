import {DEFAULT_PAGE_SIZE} from "@/constants";
import {databaseManager} from "@/db";

export const searchProducts = async (
  filter: string,
  page: number,
  userId: number,
) => {
  const prisma = databaseManager.getInstance();
  const data = await prisma.product.findMany({
    where: {
      name: {
        contains: filter,
      },
    },
    include: {
      stock: true,
      orderDetails: {
        include: {
          order: true,
        },
        where: {
          order: {
            userId: userId,
          },
        },
        orderBy: {
          order: {
            createdAt: "desc",
          },
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
    take: DEFAULT_PAGE_SIZE,
    skip: (page - 1) * DEFAULT_PAGE_SIZE,
  });

  const products = data.map(({stock, orderDetails, ...product}) => {
    return {
      ...product,
      quantity: stock.quantity,
      lastOrderedAt: orderDetails[0]?.order.createdAt,
    };
  });

  const hitCount = await prisma.product.count({
    where: {
      name: {
        contains: filter,
      },
    },
  });

  return {products, hitCount};
};

export const getProductsByIds = async (
  userId: number,
  productIds: number[],
) => {
  const prisma = databaseManager.getInstance();
  const data = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
    include: {
      stock: true,
      orderDetails: {
        include: {
          order: true,
        },
        where: {
          order: {
            userId: userId,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  const products = data.map(({stock, orderDetails, ...product}) => {
    const quantity = stock.quantity;
    const lastOrderedAt = orderDetails[0]?.order.createdAt;
    return {
      ...product,
      quantity,
      lastOrderedAt,
    };
  });
  return products;
};
