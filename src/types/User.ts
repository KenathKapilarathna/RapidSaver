export type TUser = {
  _id: string;
  id: string;
  uid: string;
  userId: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: "user" | "admin" | "driver";
  address?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};
