// types/apiResponse.ts
import { Car } from './car'; // Use the correct relative path to import Car

export interface CarApiResponse {
  count: number;
  next: number;
  previous: number;
  current: number;
  results: Car[];
}
