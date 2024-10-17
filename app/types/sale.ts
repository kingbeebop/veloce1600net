import { Car } from './car';
import { Owner } from './owner';

export interface Sale {
  id: number;  // Assuming you have an ID field for each sale
  car: Car;  // Embed the Car type
  owner: Owner;  // Embed the Owner type
  sale_price: number;  // Decimal value represented as a number
  sale_date: string;  // ISO string representation of the date
}
