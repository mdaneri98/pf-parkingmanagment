export interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt: string;
}

export interface SpotDTO extends BaseEntity {
  vehicleType: string;
  floor: number;
  code: string;
  isAvailable: boolean;
  parkingLotId: number;
}

export interface ParkingLotResponse extends BaseEntity {
  name: string;
  address: string;
  imageUrl: string;
  managerId: number;
  spots: SpotDTO[];
}

export interface UserResponse {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
}


