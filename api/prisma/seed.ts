import {PrismaClient} from "@prisma/client";
import {users} from "./seed/users";
import {stocks} from "./seed/stocks";
import {products} from "./seed/products";
import {orders} from "./seed/order";
import {orderDetails} from "./seed/order_details";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  await prisma.user.createMany({data: users});
  await prisma.stock.createMany({data: stocks});
  await prisma.product.createMany({data: products});
  await prisma.order.createMany({data: orders});
  await prisma.orderDetail.createMany({data: orderDetails});
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
