export type User = {
  id: number;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type Credentials = {
  email: string;
  password: string;
};

export type Cart = {
  [productId: number]: number;
};

export type Product = {
  id: number;
  name: string;
  price: number;
  imageName: string;
  stockId: number;
  createdAt: string;
  updatedAt: string;
  quantity: number;
  lastOrderedAt?: string;
};

export type OrderDetail = {
  id: number;
  productId: number;
  orderId: number;
  price: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  product: {
    id: number;
    name: string;
    price: number;
    imageName: string;
    stockId: number;
    createdAt: string;
    updatedAt: string;
  };
};

export type Order = {
  id: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  orderDetails: OrderDetail[];
};
