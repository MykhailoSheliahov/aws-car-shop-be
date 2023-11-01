export interface Product {
  id: string,
  title: string,
  description: string,
  price: number,
  count: number
}

export interface PostProduct {
  message: string,
  product: Product
}

export type ProductToSave = Omit<Product, 'id'>;

export type SQSProduct = {
  title: string;
  description: string;
  count: number;
  price: number;
}
