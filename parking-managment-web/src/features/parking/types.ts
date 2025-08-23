import type { BaseEntity } from '../users/types';

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


