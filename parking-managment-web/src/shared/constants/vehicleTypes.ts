// ====== Vehicle Types Constants ======
export const VEHICLE_TYPES = {
  CAR: 'auto' as const,
  MOTORCYCLE: 'moto' as const, 
  TRUCK: 'camioneta' as const,
  BICICLE: 'bicicleta' as const,
} as const;

export type VehicleType = typeof VEHICLE_TYPES[keyof typeof VEHICLE_TYPES];

// Helper functions for vehicle types
export const getVehicleTypeOptions = () => [
  { value: VEHICLE_TYPES.CAR, label: 'Car', icon: '🚗' },
  { value: VEHICLE_TYPES.MOTORCYCLE, label: 'Motorcycle', icon: '🏍️' },
  { value: VEHICLE_TYPES.TRUCK, label: 'Truck', icon: '🚛' },
  { value: VEHICLE_TYPES.BICICLE, label: 'Bicicle', icon: '🚲' },
];

// Vehicle icons mapping
export const VEHICLE_ICONS = {
  [VEHICLE_TYPES.CAR]: '🚗',
  [VEHICLE_TYPES.MOTORCYCLE]: '🏍️',
  [VEHICLE_TYPES.TRUCK]: '🚛',
  [VEHICLE_TYPES.BICICLE]: '🚲',
} as const;