export interface Car {
  id: number;  // Required
  make: string | null;  // Nullable
  model: string | null;  // Nullable
  year: number | null;  // Nullable
  vin: string | null;  // Nullable
  mileage: number | null;  // Nullable
  price: number | null;  // Nullable
  features: string | null;  // Nullable
  condition: 'New' | 'Used' | 'Classic' | null;  // Nullable
  imagePath?: string | null;  // Updated to match C# model; optional and nullable
  ownerId?: number | null;  // Updated to match C# model; nullable
  createdAt?: string | null;  // Updated to match C# model; nullable
  updatedAt?: string | null;  // Updated to match C# model; nullable
}

export interface CarData {
  make: string | null;  // Nullable
  model: string | null;  // Nullable
  year: number | null;  // Nullable
  vin: string | null;  // Nullable
  mileage: number | null;  // Nullable
  price: number | null;  // Nullable
  features: string | null;  // Nullable
  condition: 'New' | 'Used' | 'Classic' | null;  // Nullable
  ownerId?: number | null;  // Updated to match C# model; nullable
  owner?: any;
  // createdAt and updatedAt are not needed here since they are set by the backend
}
