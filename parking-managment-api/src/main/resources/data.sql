-- =============================================
-- DATOS MOCKEADOS PARA BASE H2
-- Sistema de Gestión de Estacionamientos
-- =============================================

-- Usuarios comunes
-- Contraseña "password123" hasheada con BCrypt: $2a$10$NrSSkbf/XLqEt0F5Bf3g9uOWJL6.hhvJKM1StO9.iQyCMliWAz18m
INSERT INTO common_user (first_name, last_name, email, password_hash, image_url, created_at, updated_at)
VALUES ('John', 'Doe', 'admin@admin.com', '$2a$10$NrSSkbf/XLqEt0F5Bf3g9uOWJL6.hhvJKM1StO9.iQyCMliWAz18m',
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('Juan', 'Pérez', 'juan.perez@gmail.com', '$2a$10$NrSSkbf/XLqEt0F5Bf3g9uOWJL6.hhvJKM1StO9.iQyCMliWAz18m',
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('María', 'González', 'maria.gonzalez@outlook.com',
        '$2a$10$NrSSkbf/XLqEt0F5Bf3g9uOWJL6.hhvJKM1StO9.iQyCMliWAz18m',
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('Carlos', 'Rodríguez', 'carlos.rodriguez@hotmail.com',
        '$2a$10$NrSSkbf/XLqEt0F5Bf3g9uOWJL6.hhvJKM1StO9.iQyCMliWAz18m',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('Ana', 'Martínez', 'ana.martinez@gmail.com', '$2a$10$NrSSkbf/XLqEt0F5Bf3g9uOWJL6.hhvJKM1StO9.iQyCMliWAz18m',
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('Roberto', 'López', 'roberto.lopez@gmail.com', '$2a$10$NrSSkbf/XLqEt0F5Bf3g9uOWJL6.hhvJKM1StO9.iQyCMliWAz18m',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('Laura', 'Fernández', 'laura.fernandez@outlook.com',
        '$2a$10$NrSSkbf/XLqEt0F5Bf3g9uOWJL6.hhvJKM1StO9.iQyCMliWAz18m',
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('Pepe', 'Usuario', 'pepe@gmail.com', '$2a$10$NrSSkbf/XLqEt0F5Bf3g9uOWJL6.hhvJKM1StO9.iQyCMliWAz18m',
        'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Detalles de usuarios
INSERT INTO user_detail (user_id, phone, address, created_at, updated_at)
VALUES (1, '+5411-2345-6789', 'Av. Corrientes 1234, CABA', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       (2, '+5411-3456-7890', 'Av. Santa Fe 2345, CABA', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       (3, '+5411-4567-8901', 'Av. Cabildo 3456, CABA', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       (4, '+5411-5678-9012', 'Av. Rivadavia 4567, CABA', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       (5, '+5411-6789-0123', 'Av. Belgrano 5678, CABA', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       (6, '+5411-7890-1234', 'Av. Libertador 6789, CABA', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       (7, '+5411-8901-2345', 'Av. Calle Falsa 123, CABA', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Gerentes (usuarios 5 y 6 serán gerentes)
INSERT INTO manager (user_id, created_at, updated_at)
VALUES (7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       (6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Administradores (usuario 5 será admin)
INSERT INTO admin (user_id, created_at, updated_at)
VALUES (1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Estacionamientos
INSERT INTO parking_lot (address, name, image_url, manager_id, latitude, longitude, created_at, updated_at)
VALUES ('Av. Corrientes 1500', 'Estacionamiento 1',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', 1, -34.6025, -58.3958, CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP),
       ('Av. Santa Fe 3000, Palermo, CABA', 'Estacionamiento 2',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', 2, -34.5833, -58.4196, CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP),
       ('Av. Cabildo 2800, Belgrano, CABA', 'Estacionamiento 3',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', 1, -34.5705, -58.4415, CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP);

-- Espacios de estacionamiento
-- Estacionamiento 1 (Corrientes) - 12 espacios
INSERT INTO spot (vehicle_type, floor, code, is_available, parking_lot_id, created_at, updated_at)
VALUES ('AUTO', 0, 'PB-A01', true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('AUTO', 0, 'PB-A02', false, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('AUTO', 0, 'PB-A03', true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('AUTO', 0, 'PB-A04', true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('AUTO', 1, '1P-A01', true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('AUTO', 1, '1P-A02', false, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('AUTO', 1, '1P-A03', true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('MOTO', 0, 'PB-M01', true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('MOTO', 0, 'PB-M02', true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('MOTO', 0, 'PB-M03', false, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('CAMIONETA', 0, 'PB-C01', true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('CAMIONETA', 0, 'PB-C02', true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Estacionamiento 2 (Santa Fe) - 10 espacios
INSERT INTO spot (vehicle_type, floor, code, is_available, reservation_priority, parking_lot_id, created_at, updated_at)
VALUES ('AUTO', -1, 'S1-A01', true, false, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('AUTO', -1, 'S1-A02', true, false, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('AUTO', -1, 'S1-A03', false, false, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('AUTO', -1, 'S1-A04', true, false, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('AUTO', -1, 'S1-A05', true, true, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('AUTO', -1, 'S1-A06', false, true, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('MOTO', -1, 'S1-M01', true, true, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('MOTO', -1, 'S1-M02', true, false, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('CAMIONETA', -1, 'S1-C01', true, false, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('CAMIONETA', -1, 'S1-C02', true, false, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Estacionamiento 3 (Cabildo) - 8 espacios
INSERT INTO spot (vehicle_type, floor, code, is_available, parking_lot_id, created_at, updated_at)
VALUES ('AUTO', 0, 'CB-A01', true, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('AUTO', 0, 'CB-A02', true, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('AUTO', 0, 'CB-A03', true, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('AUTO', 0, 'CB-A04', false, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('MOTO', 0, 'CB-M01', true, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('MOTO', 0, 'CB-M02', true, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('CAMIONETA', 0, 'CB-C01', true, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('CAMIONETA', 0, 'CB-C02', true, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Precios de estacionamiento (por hora)
INSERT INTO parking_price (vehicle_type, price, valid_from, valid_to, parking_lot_id, created_at, updated_at)
VALUES
-- Estacionamiento 1 (Corrientes) - Precios actuales
('AUTO', 800.00, '2024-01-01 00:00:00', NULL, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('MOTO', 400.00, '2024-01-01 00:00:00', NULL, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CAMIONETA', 1200.00, '2024-01-01 00:00:00', NULL, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- Estacionamiento 2 (Santa Fe) - Precios actuales
('AUTO', 1000.00, '2024-01-01 00:00:00', NULL, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('MOTO', 500.00, '2024-01-01 00:00:00', NULL, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CAMIONETA', 1500.00, '2024-01-01 00:00:00', NULL, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- Estacionamiento 3 (Cabildo) - Precios actuales
('AUTO', 700.00, '2024-01-01 00:00:00', NULL, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('MOTO', 350.00, '2024-01-01 00:00:00', NULL, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CAMIONETA', 1050.00, '2024-01-01 00:00:00', NULL, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Vehículos
INSERT INTO vehicle (license_plate, brand, model, type, created_at, updated_at)
VALUES ('ABC123', 'Toyota', 'Corolla', 'AUTO', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('DEF456', 'Honda', 'Civic', 'AUTO', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('GHI789', 'Yamaha', 'YBR 125', 'MOTO', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('JKL012', 'Ford', 'EcoSport', 'CAMIONETA', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('MNO345', 'Chevrolet', 'Onix', 'AUTO', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('PQR678', 'Bajaj', 'Pulsar', 'MOTO', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('STU901', 'Volkswagen', 'Amarok', 'CAMIONETA', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Asignaciones usuario-vehículo
INSERT INTO user_vehicle_assignment (user_id, vehicle_license_plate, created_at, updated_at)
VALUES (1, 'ABC123', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       (2, 'DEF456', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       (2, 'GHI789', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       (3, 'JKL012', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       (4, 'MNO345', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       (4, 'PQR678', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       (1, 'STU901', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Reservas programadas
INSERT INTO scheduled_reservation (reserved_start_time, expected_end_time, status, estimated_price, spot_id,
                                   user_id, vehicle_license_plate, spot_code_snapshot, spot_floor_snapshot,
                                   created_at, updated_at)
VALUES
-- Reserva completada (ayer)
('2024-12-18 09:00:00', '2024-12-18 18:00:00', 'COMPLETED', 7200.00, 2, 1, 'ABC123', null, null,
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- Reserva confirmada (hoy)
('2024-12-19 08:00:00', '2024-12-19 17:00:00', 'CONFIRMED', 8000.00, 6, 2, 'DEF456', null, null,
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- Reserva futura
('2024-12-20 10:00:00', '2024-12-20 14:00:00', 'CONFIRMED', 3200.00, 1, 3, 'JKL012', null, null,
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- Reserva en progreso
('2024-12-19 14:00:00', '2024-12-19 20:00:00', 'IN_PROGRESS', 2100.00, 10, 4, 'PQR678', null, null,
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- Reserva cancelada
('2024-12-18 12:00:00', '2024-12-18 16:00:00', 'CANCELLED', 2800.00, 15, 2, 'GHI789', null, null,
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Estancias walk-in
INSERT INTO walk_in_stay (check_in_time, check_out_time, total_price, status, spot_id, user_id, vehicle_license_plate,
                          expected_end_time, spot_code_snapshot, spot_floor_snapshot, created_at, updated_at)
VALUES
-- Estancia completada
('2024-12-17 15:30:00', '2024-12-17 18:45:00', 2600.00, 'ACTIVE', 1, 1, 'ABC123', '2024-12-17 22:45:00', null,
 null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- Estancia completada
('2024-12-18 11:15:00', '2024-12-18 13:30:00', 2250.00, 'ACTIVE', 2, 2, 'DEF456', '2024-12-18 18:45:00', null,
 null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- Estancia en curso (sin check-out)
('2025-10-04 10:00:00', NULL, NULL, 'ACTIVE', 4, 2, 'DEF456', '2025-10-04 12:35:00', null, null,
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


-- Reseñas
INSERT INTO review (rating, comment, user_id, parking_lot_id, created_at, updated_at)
VALUES (5, 'Excelente estacionamiento, muy seguro y bien ubicado. El personal es muy amable.', 1, 1, CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP),
       (4, 'Buen servicio, aunque un poco caro. Las instalaciones están bien mantenidas.', 2, 2, CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP),
       (5, 'Perfecto para el trabajo, siempre hay lugar y es muy conveniente.', 3, 1, CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP),
       (3, 'Está bien, pero los espacios son un poco pequeños para camionetas.', 4, 3, CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP),
       (4, 'Muy buena ubicación en Palermo, fácil acceso y salida.', 1, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       (2, 'Tuve problemas con el sistema de pago, tardó mucho en resolverse.', 2, 3, CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP);

-- Incidentes
INSERT INTO incident (description, status, walk_in_stay_id, scheduled_reservation_id, created_at, updated_at)
VALUES
-- Incidente resuelto en walk-in
('Vehículo bloqueado por otro auto mal estacionado', 'RESOLVED', 1, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- Incidente en progreso en reserva
('Problema con el sistema de apertura del portón', 'IN_PROGRESS', NULL, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- Incidente reportado
('Falta de iluminación en el sector de motos', 'REPORTED', 2, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- Incidente cerrado
('Derrame de aceite en el espacio PB-A03', 'CLOSED', NULL, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
