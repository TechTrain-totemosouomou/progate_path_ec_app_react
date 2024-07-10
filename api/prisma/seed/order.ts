import {Order} from "@prisma/client";

export const orders: Order[] = [
  {
    id: 1,
    userId: 1,
    createdAt: new Date(2023, 0, 1),
    updatedAt: new Date(2023, 0, 1),
  },
  {
    id: 2,
    userId: 1,
    createdAt: new Date(2024, 0, 1),
    updatedAt: new Date(2024, 0, 1),
  },
  {
    id: 3,
    userId: 2,
    createdAt: new Date(2023, 0, 1),
    updatedAt: new Date(2023, 0, 1),
  },
  {
    id: 4,
    userId: 2,
    createdAt: new Date(2024, 0, 1),
    updatedAt: new Date(2024, 0, 1),
  },
];
