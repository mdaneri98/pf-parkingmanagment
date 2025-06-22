import type {
  User,
  UserDetail,
  Manager,
  Vehicle,
  ParkingLot,
  ParkingPrice,
  Review,
  Spot,
  ScheduledReservation,
  WalkInStay,
  Incident
} from '../types';

export const mockUsers: User[] = [
  {
    id: 1,
    first_name: 'Juan',
    last_name: 'Pérez',
    email: 'juan.perez@example.com',
    password_hash: 'hashed_password_1',
    image_url: null,
    created_at: '2025-06-01',
    updated_at: '2025-06-10',
  },
  {
    id: 2,
    first_name: 'Ana',
    last_name: 'Gómez',
    email: 'ana.gomez@example.com',
    password_hash: 'hashed_password_2',
    image_url: 'https://i.pravatar.cc/150?img=5',
    created_at: '2025-06-02',
    updated_at: '2025-06-10',
  },
  {
    id: 3,
    first_name: 'Luis',
    last_name: 'Martínez',
    email: 'luis.martinez@example.com',
    password_hash: 'hashed_password_3',
    image_url: 'https://i.pravatar.cc/150?img=10',
    created_at: '2025-06-03',
    updated_at: '2025-06-11',
  }
];

export const mockUserDetails: UserDetail[] = [
  {
    id: 1,
    phone: '1234567890',
    address: 'Calle Falsa 123',
    created_at: '2025-06-01',
    updated_at: '2025-06-10',
    user_id: 1
  },
  {
    id: 2,
    phone: '2345678901',
    address: 'Avenida Siempre Viva 742',
    created_at: '2025-06-02',
    updated_at: '2025-06-10',
    user_id: 2
  }
];

export const mockManagers: Manager[] = [
  {
    id: 1,
    created_at: '2025-06-01',
    updated_at: '2025-06-10',
    user_id: 1
  },
  {
    id: 2,
    created_at: '2025-0-01',
    updated_at: '2025-02-10',
    user_id: 2
  }
];

export const mockVehicles: Vehicle[] = [
  {
    license_plate: 'ABC123',
    brand: 'Toyota',
    model: 'Corolla',
    type: 'Car',
    created_at: '2025-06-05',
    updated_at: '2025-06-10',
    user_id: 1
  },
  {
    license_plate: 'XYZ987',
    brand: 'Yamaha',
    model: 'FZ25',
    type: 'Motorcycle',
    created_at: '2025-06-06',
    updated_at: '2025-06-11',
    user_id: 2
  },
  {
    license_plate: 'DEF456',
    brand: 'Volkswagen',
    model: 'Golf',
    type: 'Car',
    created_at: '2025-06-07',
    updated_at: '2025-06-12',
    user_id: 3
  }
];

export const mockParkingLots: ParkingLot[] = [
  {
    id: 1,
    address: 'Av. Principal 456',
    image_url: 'https://via.placeholder.com/150',
    created_at: '2025-06-01',
    updated_at: '2025-06-10',
    manager_id: 1
  },
  {
    id: 2,
    address: 'Calle Secundaria 789',
    image_url: 'https://via.placeholder.com/150',
    created_at: '2025-06-03',
    updated_at: '2025-06-10',
    manager_id: 2
  }
];

export const mockParkingPrices: ParkingPrice[] = [
  {
    id: 1,
    vehicle_type: 'Car',
    price: 2.5,
    valid_from: '2025-06-01T00:00:00Z',
    valid_to: '2025-12-31T23:59:59Z',
    created_at: '2025-06-01',
    updated_at: '2025-06-10',
    parking_lot_id: 1
  },
  {
    id: 2,
    vehicle_type: 'Motorcycle',
    price: 1.2,
    valid_from: '2025-06-01T00:00:00Z',
    valid_to: '2025-12-31T23:59:59Z',
    created_at: '2025-06-01',
    updated_at: '2025-06-10',
    parking_lot_id: 1
  },
  {
    id: 3,
    vehicle_type: 'Car',
    price: 3.0,
    valid_from: '2025-06-01T00:00:00Z',
    valid_to: '2025-12-31T23:59:59Z',
    created_at: '2025-06-01',
    updated_at: '2025-06-10',
    parking_lot_id: 2
  }
];

export const mockReviews: Review[] = [
  {
    id: 1,
    rating: 5,
    comment: 'Excelente servicio',
    created_at: '2025-06-10',
    updated_at: '2025-06-10',
    user_id: 1,
    parking_lot_id: 1
  },
  {
    id: 2,
    rating: 4,
    comment: 'Buen lugar pero un poco caro',
    created_at: '2025-06-11',
    updated_at: '2025-06-11',
    user_id: 2,
    parking_lot_id: 2
  }
];

export const mockSpots: Spot[] = [
  // Piso 1 - Sector A (Autos)
  {
    id: 1,
    vehicle_type: 'Car',
    floor: '1',
    code: 'A1',
    is_available: true,
    created_at: '2025-06-01',
    updated_at: '2025-06-10',
    parking_lot_id: 1
  },
  {
    id: 2,
    vehicle_type: 'Car',
    floor: '1',
    code: 'A2',
    is_available: false,
    created_at: '2025-06-01',
    updated_at: '2025-06-10',
    parking_lot_id: 1
  },
  {
    id: 3,
    vehicle_type: 'Car',
    floor: '1',
    code: 'A3',
    is_available: true,
    created_at: '2025-06-01',
    updated_at: '2025-06-10',
    parking_lot_id: 1
  },
  {
    id: 4,
    vehicle_type: 'Car',
    floor: '1',
    code: 'A4',
    is_available: true,
    created_at: '2025-06-01',
    updated_at: '2025-06-10',
    parking_lot_id: 1
  },
  // Piso 1 - Sector B (Motos)
  {
    id: 5,
    vehicle_type: 'Motorcycle',
    floor: '1',
    code: 'B1',
    is_available: false,
    created_at: '2025-06-01',
    updated_at: '2025-06-10',
    parking_lot_id: 1
  },
  {
    id: 6,
    vehicle_type: 'Motorcycle',
    floor: '1',
    code: 'B2',
    is_available: true,
    created_at: '2025-06-01',
    updated_at: '2025-06-10',
    parking_lot_id: 1
  },
  {
    id: 7,
    vehicle_type: 'Motorcycle',
    floor: '1',
    code: 'B3',
    is_available: true,
    created_at: '2025-06-01',
    updated_at: '2025-06-10',
    parking_lot_id: 1
  },
  // Piso 2 - Sector C (Autos Premium)
  {
    id: 8,
    vehicle_type: 'Car',
    floor: '2',
    code: 'C1',
    is_available: true,
    created_at: '2025-06-01',
    updated_at: '2025-06-10',
    parking_lot_id: 1
  },
  {
    id: 9,
    vehicle_type: 'Car',
    floor: '2',
    code: 'C2',
    is_available: false,
    created_at: '2025-06-01',
    updated_at: '2025-06-10',
    parking_lot_id: 1
  },
  {
    id: 10,
    vehicle_type: 'Car',
    floor: '2',
    code: 'C3',
    is_available: true,
    created_at: '2025-06-03',
    updated_at: '2025-06-10',
    parking_lot_id: 1
  },
  // Piso 2 - Sector D (Discapacitados)
  {
    id: 11,
    vehicle_type: 'Car',
    floor: '2',
    code: 'D1',
    is_available: true,
    created_at: '2025-06-01',
    updated_at: '2025-06-10',
    parking_lot_id: 1
  },
  {
    id: 12,
    vehicle_type: 'Car',
    floor: '2',
    code: 'D2',
    is_available: false,
    created_at: '2025-06-01',
    updated_at: '2025-06-10',
    parking_lot_id: 1
  },
  // Piso 3 - Sector E (Carga)
  {
    id: 13,
    vehicle_type: 'Truck',
    floor: '3',
    code: 'E1',
    is_available: true,
    created_at: '2025-06-01',
    updated_at: '2025-06-10',
    parking_lot_id: 1
  },
  {
    id: 14,
    vehicle_type: 'Truck',
    floor: '3',
    code: 'E2',
    is_available: true,
    created_at: '2025-06-01',
    updated_at: '2025-06-10',
    parking_lot_id: 1
  },
  // Espacios para el segundo parking lot
  {
    id: 15,
    vehicle_type: 'Car',
    floor: '1',
    code: 'A1',
    is_available: true,
    created_at: '2025-06-01',
    updated_at: '2025-06-10',
    parking_lot_id: 2
  },
  {
    id: 16,
    vehicle_type: 'Car',
    floor: '1',
    code: 'A2',
    is_available: false,
    created_at: '2025-06-01',
    updated_at: '2025-06-10',
    parking_lot_id: 2
  },
  {
    id: 17,
    vehicle_type: 'Motorcycle',
    floor: '1',
    code: 'B1',
    is_available: true,
    created_at: '2025-06-01',
    updated_at: '2025-06-10',
    parking_lot_id: 2
  }
];

export const mockScheduledReservations: ScheduledReservation[] = [
  {
    id: 1,
    reserved_start_time: '2025-06-20T08:00:00Z',
    expected_end_time: '2025-06-20T10:00:00Z',
    status: 'reserved',
    estimated_price: 5.0,
    created_at: '2025-06-19',
    updated_at: '2025-06-19',
    spot_id: 1,
    vehicle_user_id: 1,
    vehicle_license_plate: 'ABC123'
  },
  {
    id: 2,
    reserved_start_time: '2025-06-21T09:00:00Z',
    expected_end_time: '2025-06-21T11:00:00Z',
    status: 'completed',
    estimated_price: 6.0,
    created_at: '2025-06-20',
    updated_at: '2025-06-21',
    spot_id: 3,
    vehicle_user_id: 3,
    vehicle_license_plate: 'DEF456'
  }
];

export const mockWalkInStays: WalkInStay[] = [
  {
    id: 1,
    check_in_time: '2025-06-20T09:00:00Z',
    check_out_time: '2025-06-20T10:30:00Z',
    total_price: 4.5,
    created_at: '2025-06-20',
    updated_at: '2025-06-20',
    vehicle_user_id: 1,
    vehicle_license_plate: 'ABC123',
    spot_id: 1
  },
  {
    id: 2,
    check_in_time: '2025-06-21T12:00:00Z',
    check_out_time: '2025-06-21T12:00:00Z',
    total_price: 0,
    created_at: '2025-06-21',
    updated_at: '2025-06-21',
    vehicle_user_id: 2,
    vehicle_license_plate: 'XYZ987',
    spot_id: 2
  }
];

export const mockIncidents: Incident[] = [
  {
    id: 1,
    description: 'Golpe en el parachoques',
    status: 'open',
    created_at: '2025-06-20',
    updated_at: '2025-06-20',
    walk_in_stay_id: 1,
    scheduled_reservation_id: null
  },
  {
    id: 2,
    description: 'Robo del espejo retrovisor',
    status: 'resolved',
    created_at: '2025-06-21',
    updated_at: '2025-06-22',
    walk_in_stay_id: null,
    scheduled_reservation_id: 2
  }
];
