// utils/filterCars.ts
import { Car } from '../types/car';
import { RootState } from '../redux/store'; // Make sure to import your RootState type
import { useSelector } from 'react-redux';

export const filterCars = (filters: {
  searchTerm?: string;
  priceFilter?: { operator: 'greater' | 'less'; value: number } | null;
  conditionFilter?: 'New' | 'Used' | 'Classic' | null;
}) => {
  // Access allCars from the Redux store
  const allCars: Car[] = useSelector((state: RootState) => state.cars.allCars);

  const { searchTerm, priceFilter, conditionFilter } = filters;

  // Check if all filter fields are null, empty, or undefined
  const areAllFiltersEmpty = !searchTerm && !priceFilter && !conditionFilter;

  // If all filters are empty, return allCars
  if (areAllFiltersEmpty) {
    return allCars;
  }

  // Start with all cars
  let filteredCars = [...allCars];

  // Apply search term filtering
  if (searchTerm) {
    const searchStr = searchTerm.toLowerCase();
    filteredCars = filteredCars.filter(car => {
      return (
        car.make?.toLowerCase().includes(searchStr) ||
        car.model?.toLowerCase().includes(searchStr) ||
        car.year?.toString().includes(searchStr)
      );
    });
  }

  // Apply price filter if it exists
  if (priceFilter) {
    filteredCars = filteredCars.filter(car => {
      if (priceFilter.operator === 'greater') {
        return car.price != null && car.price > priceFilter.value;
      } else if (priceFilter.operator === 'less') {
        return car.price != null && car.price < priceFilter.value;
      }
      return true;
    });
  }

  // Apply condition filter if it exists
  if (conditionFilter) {
    filteredCars = filteredCars.filter(car =>
      (car.condition && car.condition.toLowerCase() === conditionFilter.toLowerCase()) || car.condition == null
    );
  }

  return filteredCars;
};
