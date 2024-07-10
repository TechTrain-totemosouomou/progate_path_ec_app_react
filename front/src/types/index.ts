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
