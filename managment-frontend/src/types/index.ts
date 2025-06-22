export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password_hash: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserDetail {
  id: number;
  phone: string;
  address: string;
  created_at: string;
  updated_at: string;
  user_id: number;
}

export interface Manager {
  id: number;
  created_at: string;
  updated_at: string;
  user_id: number;
}

export interface Vehicle {
  license_plate: string;
  brand: string;
  model: string;
  type: string;
  created_at: string;
  updated_at: string;
  user_id: number;
}

export interface ParkingLot {
  id: number;
  address: string;
  image_url: string;
  created_at: string;
  updated_at: string;
  manager_id: number;
}

export interface ParkingPrice {
  id: number;
  vehicle_type: string;
  price: number;
  valid_from: string; 
  valid_to: string;  
  created_at: string;
  updated_at: string;
  parking_lot_id: number;
}

export interface Review {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
  user_id: number;
  parking_lot_id: number;
}

export interface Spot {
  id: number;
  vehicle_type: string;
  floor: string;
  label: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
  parking_lot_id: number;
}

export interface ScheduledReservation {
  id: number;
  reserved_start_time: string;
  expected_end_time: string;
  status: string;
  estimated_price: number;
  created_at: string;
  updated_at: string;
  spot_id: number;
  vehicle_user_id: number;
  vehicle_license_plate: string;
}

export interface WalkInStay {
  id: number;
  check_in_time: string;
  check_out_time: string;
  total_price: number;
  created_at: string;
  updated_at: string;
  vehicle_user_id: number;
  vehicle_license_plate: string;
  spot_id: number;
}

export interface Incident {
  id: number;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
  walk_in_stay_id: number | null;
  scheduled_reservation_id: number | null;
}
