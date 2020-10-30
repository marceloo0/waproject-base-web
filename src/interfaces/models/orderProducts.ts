export default interface IOrderProducts {
  id?: number;
  name: string;
  description: string;
  quantity: number;
  price: number;

  createdDate?: Date;
  updatedDate?: Date;
}
