export interface Product {
  id: string,
  title: string,
  description: string,
  price: number,
  count:number
}

export interface PostProduct {
  message:string,
  product: Product
}
