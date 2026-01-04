-- =============================================
-- DATOS MOCKEADOS PARA BASE H2
-- Sistema de Gestión de Estacionamientos
-- =============================================

-- Usuarios comunes
-- Contraseña "password123" hasheada con BCrypt: $2a$10$NrSSkbf/XLqEt0F5Bf3g9uOWJL6.hhvJKM1StO9.iQyCMliWAz18m
INSERT INTO common_user (first_name, last_name, email, password_hash, image_url, created_at, updated_at)
VALUES ('default', 'default', 'default@default.com', '$2a$10$NrSSkbf/XLqEt0F5Bf3g9uOWJL6.hhvJKM1StO9.iQyCMliWAz18m',
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('John', 'Doe', 'admin@admin.com', '$2a$10$NrSSkbf/XLqEt0F5Bf3g9uOWJL6.hhvJKM1StO9.iQyCMliWAz18m',
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
INSERT INTO user_detail (phone, address, lang, created_at, updated_at)
VALUES ('+5411-2345-6789', 'Av. Corrientes 1234, CABA', 'en', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('+5411-3456-7890', 'Av. Santa Fe 2345, CABA', 'en', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('+5411-4567-8901', 'Av. Cabildo 3456, CABA', 'en', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('+5411-5678-9012', 'Av. Rivadavia 4567, CABA', 'en', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('+5411-6789-0123', 'Av. Belgrano 5678, CABA', 'en', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('+5411-7890-1234', 'Av. Libertador 6789, CABA', 'en', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('+5411-8901-2345', 'Av. Calle Falsa 123, CABA', 'en', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('+5411-9012-3456', 'Av. San Martín 789, CABA', 'en', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Link users to their details
UPDATE common_user SET user_detail_id = 1 WHERE id = 1;
UPDATE common_user SET user_detail_id = 2 WHERE id = 2;
UPDATE common_user SET user_detail_id = 3 WHERE id = 3;
UPDATE common_user SET user_detail_id = 4 WHERE id = 4;
UPDATE common_user SET user_detail_id = 5 WHERE id = 5;
UPDATE common_user SET user_detail_id = 6 WHERE id = 6;
UPDATE common_user SET user_detail_id = 7 WHERE id = 7;
UPDATE common_user SET user_detail_id = 8 WHERE id = 8;

-- Gerentes (usuarios 5 y 6 serán gerentes)
INSERT INTO manager (user_id, created_at, updated_at)
VALUES (8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       (7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

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
INSERT INTO spot (vehicle_type, floor, code, is_available, is_reservable, is_accessible, parking_lot_id,
                  created_at, updated_at)
VALUES ('auto', 0, 'A01', FALSE, FALSE, FALSE, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('auto', 0, 'A02', TRUE, FALSE, FALSE, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('auto', 0, 'A03', TRUE, FALSE, FALSE, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('auto', 0, 'A04', FALSE, FALSE, FALSE, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('auto', 1, 'A01', TRUE, FALSE, FALSE, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('auto', 1, 'A02', TRUE, FALSE, FALSE, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('auto', 1, 'A03', TRUE, FALSE, FALSE, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('moto', 0, 'M01', TRUE, FALSE, FALSE, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('moto', 0, 'M02', TRUE, FALSE, FALSE, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('moto', 0, 'M03', FALSE, FALSE, FALSE, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('camioneta', 0, 'C01', TRUE, FALSE, FALSE, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('camioneta', 0, 'C02', TRUE, FALSE, FALSE, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

---

-- Estacionamiento 2 (Santa Fe) - 10 espacios
INSERT INTO spot (vehicle_type, floor, code, is_available, is_reservable, is_accessible, parking_lot_id,
                  created_at, updated_at)
VALUES ('auto', -1, 'A01', TRUE, FALSE, FALSE, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('auto', -1, 'A02', TRUE, FALSE, FALSE, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('auto', -1, 'A03', TRUE, FALSE, FALSE, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('auto', -1, 'A04', TRUE, FALSE, FALSE, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('auto', -1, 'A05', TRUE, TRUE, FALSE, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('auto', -1, 'A06', TRUE, TRUE, FALSE, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('moto', -1, 'M01', TRUE, TRUE, FALSE, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('moto', -1, 'M02', TRUE, FALSE, FALSE, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('camioneta', -1, 'C01', TRUE, FALSE, FALSE, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('camioneta', -1, 'C02', TRUE, FALSE, FALSE, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

---

-- Estacionamiento 3 (Cabildo) - 8 espacios
INSERT INTO spot (vehicle_type, floor, code, is_available, is_reservable, is_accessible, parking_lot_id,
                  created_at, updated_at)
VALUES ('auto', 0, 'CAB-A01', TRUE, FALSE, FALSE, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('auto', 0, 'CAB-A02', FALSE, FALSE, FALSE, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('auto', 0, 'CAB-A03', TRUE, FALSE, FALSE, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('auto', 1, 'CAB-A04', TRUE, TRUE, FALSE, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('moto', 0, 'CAB-M01', TRUE, FALSE, FALSE, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('moto', 0, 'CAB-M02', TRUE, FALSE, FALSE, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('camioneta', 0, 'CAB-C01', TRUE, FALSE, FALSE, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('camioneta', 0, 'CAB-C02', TRUE, FALSE, FALSE, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Precios de estacionamiento (por hora)
INSERT INTO parking_price (vehicle_type, price, valid_from, valid_to, parking_lot_id, created_at, updated_at)
VALUES
-- Estacionamiento 1 (Corrientes) - Precios actuales
('auto', 900.00, '2025-01-01 00:00:00', '2026-01-01 00:00:00', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('moto', 450.00, '2025-01-01 00:00:00', '2026-01-01 00:00:00', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('camioneta', 1300.00, '2025-01-01 00:00:00', '2026-01-01 00:00:00', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- Estacionamiento 2 (Santa Fe) - Precios actuales
('auto', 1100.00, '2025-01-01 00:00:00', '2026-01-01 00:00:00', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('moto', 550.00, '2025-01-01 00:00:00', '2026-01-01 00:00:00', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('camioneta', 1600.00, '2025-01-01 00:00:00', NULL, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- Estacionamiento 3 (Cabildo) - Precios actuales
('auto', 750.00, '2025-01-01 00:00:00', NULL, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('moto', 380.00, '2025-01-01 00:00:00', NULL, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('camioneta', 1100.00, '2025-01-01 00:00:00', NULL, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Vehículos
INSERT INTO vehicle (license_plate, brand, model, type, created_at, updated_at)
VALUES ('ABC123', 'Toyota', 'Corolla', 'auto', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('DEF456', 'Honda', 'Civic', 'auto', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('GHI789', 'Yamaha', 'YBR 125', 'moto', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('JKL012', 'Ford', 'EcoSport', 'camioneta', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('MNO345', 'Chevrolet', 'Onix', 'auto', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('PQR678', 'Bajaj', 'Pulsar', 'moto', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('STU901', 'Volkswagen', 'Amarok', 'camioneta', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('LAU001', 'BMW', 'X3', 'camioneta', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('LAU002', 'Audi', 'A4', 'auto', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Asignaciones usuario-vehículo
INSERT INTO user_vehicle_assignment (user_id, vehicle_license_plate, created_at, updated_at)
VALUES (1, 'ABC123', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       (2, 'DEF456', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       (2, 'GHI789', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       (3, 'JKL012', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       (4, 'MNO345', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       (4, 'PQR678', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       (1, 'STU901', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       (7, 'LAU001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       (7, 'LAU002', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Reservas programadas
INSERT INTO scheduled_reservation (reserved_start_time, expected_end_time, status, estimated_price, spot_id,
                                   user_id, vehicle_license_plate, spot_code_snapshot, spot_floor_snapshot,
                                   created_at, updated_at)
VALUES
-- Pendiente (futuro cercano)
('2025-10-28 09:00:00', '2025-10-30 18:00:00', 'PENDING', 7200.00, 2, 1, 'ABC123', null, null, CURRENT_TIMESTAMP,
 CURRENT_TIMESTAMP),
-- Pendiente (futuro lejano)
('2025-12-12 08:00:00', '2025-12-12 17:00:00', 'PENDING', 8000.00, 6, 2, 'DEF456', null, null, CURRENT_TIMESTAMP,
 CURRENT_TIMESTAMP),
-- En progreso
('2025-10-24 10:00:00', '2025-10-24 20:00:00', 'ACTIVE', 2100.00, 4, 3, 'JKL012', null, null, CURRENT_TIMESTAMP,
 CURRENT_TIMESTAMP),
-- Cancelada (ayer)
('2025-10-11 12:00:00', '2025-10-11 16:00:00', 'CANCELLED', 2800.00, 3, 2, 'GHI789', null, null, CURRENT_TIMESTAMP,
 CURRENT_TIMESTAMP),
-- Reserva de Laura Fernández (futura)
(CURRENT_TIMESTAMP + INTERVAL '2' DAY + INTERVAL '9' HOUR, CURRENT_TIMESTAMP + INTERVAL '2' DAY + INTERVAL '18' HOUR,
 'PENDING', 6300.00, 23, 7, 'LAU001', null, null,
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- Reserva de Laura Fernández (confirmada)
(CURRENT_TIMESTAMP + INTERVAL '3' DAY + INTERVAL '10' HOUR, CURRENT_TIMESTAMP + INTERVAL '3' DAY + INTERVAL '16' HOUR,
 'CONFIRMED', 4200.00, 24, 7, 'LAU002', null, null,
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Estancias walk-in
INSERT INTO walk_in_stay (check_in_time, check_out_time, total_price, status, spot_id, user_id, vehicle_license_plate,
                          expected_end_time, spot_code_snapshot, spot_floor_snapshot, created_at, updated_at)
VALUES
-- Estancia activa (hace 1 hora)
(CURRENT_TIMESTAMP - INTERVAL '1' HOUR, CURRENT_TIMESTAMP + INTERVAL '2' HOUR, null, 'ACTIVE', 1, 1, 'ABC123',
 CURRENT_TIMESTAMP, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- Estancia completada (ayer)
(CURRENT_TIMESTAMP - INTERVAL '1' DAY + INTERVAL '11' HOUR + INTERVAL '15' MINUTE,
 CURRENT_TIMESTAMP - INTERVAL '1' DAY + INTERVAL '13' HOUR + INTERVAL '30' MINUTE, 2250.00, 'COMPLETED', 2, 2, 'DEF456',
 CURRENT_TIMESTAMP - INTERVAL '1' DAY + INTERVAL '18' HOUR + INTERVAL '45' MINUTE, null,
 null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- Estancia en curso (hace 2 horas)
(CURRENT_TIMESTAMP - INTERVAL '2' HOUR, NULL, NULL, 'ACTIVE', 4, 2, 'DEF456',
 CURRENT_TIMESTAMP + INTERVAL '2' HOUR + INTERVAL '35' MINUTE, null, null,
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- Estancia de Laura Fernández (completada hace 3 días)
(CURRENT_TIMESTAMP - INTERVAL '3' DAY + INTERVAL '14' HOUR,
 CURRENT_TIMESTAMP - INTERVAL '3' DAY + INTERVAL '17' HOUR + INTERVAL '30' MINUTE, 3150.00, 'COMPLETED', 23, 7,
 'LAU001', CURRENT_TIMESTAMP - INTERVAL '3' DAY + INTERVAL '20' HOUR + INTERVAL '30' MINUTE, null,
 null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- Estancia de Laura Fernández (en curso desde hace 1 hora)
(CURRENT_TIMESTAMP - INTERVAL '1' HOUR, NULL, NULL, 'ACTIVE', 24, 7, 'LAU002', CURRENT_TIMESTAMP + INTERVAL '5' HOUR,
 null, null,
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Spot 10: M03 (moto) → activa hace 3 horas
(CURRENT_TIMESTAMP - INTERVAL '3' HOUR, NULL, NULL, 'ACTIVE', 10, 4, 'MNO345',
 CURRENT_TIMESTAMP + INTERVAL '5' HOUR, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


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
        CURRENT_TIMESTAMP),
       (5, 'Increíble servicio! Los espacios para camionetas son amplios y el personal muy profesional.', 7, 3,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP),
       (4, 'Buena ubicación en Cabildo, aunque un poco caro para motos.', 7, 3, CURRENT_TIMESTAMP,
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
('Derrame de aceite en el espacio PB-A03', 'CLOSED', NULL, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- Incidente de Laura Fernández (resuelto)
('Problema con el sistema de pago automático', 'RESOLVED', 4, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- Incidente de Laura Fernández (en progreso)
('Daño menor en el parachoques durante el estacionamiento', 'IN_PROGRESS', 5, NULL, CURRENT_TIMESTAMP,
 CURRENT_TIMESTAMP);

-- =============================================
-- SECCIÓN ESPECIAL: LAURA FERNÁNDEZ
-- Email: laura.fernandez@outlook.com
-- User ID: 7
-- =============================================

-- Información de Laura Fernández:
-- - Nombre: Laura Fernández
-- - Email: laura.fernandez@outlook.com
-- - Teléfono: +5411-8901-2345
-- - Dirección: Av. Calle Falsa 123, CABA
-- - Rol: Gerente (Manager ID: 1)

-- Vehículos asignados:
-- - LAU001: BMW X3 (CAMIONETA)
-- - LAU002: Audi A4 (AUTO)

-- Estacionamientos gestionados:
-- - Parking Lot ID: 1 - Estacionamiento 1 (Av. Corrientes 1500)
-- - Parking Lot ID: 3 - Estacionamiento 3 (Av. Cabildo 2800, Belgrano, CABA)

-- Espacios de estacionamiento gestionados:
-- Estacionamiento 1 (ID: 1):
-- - Spot ID: 1 - PB-A01 (AUTO, Planta Baja, Disponible)
-- - Spot ID: 2 - PB-A02 (AUTO, Planta Baja, Ocupado)
-- - Spot ID: 3 - PB-A03 (AUTO, Planta Baja, Disponible)
-- - Spot ID: 4 - PB-A04 (AUTO, Planta Baja, Disponible)
-- - Spot ID: 5 - 1P-A01 (AUTO, Piso 1, Disponible)
-- - Spot ID: 6 - 1P-A02 (AUTO, Piso 1, Ocupado)
-- - Spot ID: 7 - 1P-A03 (AUTO, Piso 1, Disponible)
-- - Spot ID: 8 - PB-M01 (MOTO, Planta Baja, Disponible)
-- - Spot ID: 9 - PB-M02 (MOTO, Planta Baja, Disponible)
-- - Spot ID: 10 - PB-M03 (MOTO, Planta Baja, Ocupado)
-- - Spot ID: 11 - PB-C01 (CAMIONETA, Planta Baja, Disponible)
-- - Spot ID: 12 - PB-C02 (CAMIONETA, Planta Baja, Disponible)

-- Estacionamiento 3 (ID: 3):
-- - Spot ID: 23 - CAB-A01 (AUTO, Planta Baja, Disponible)
-- - Spot ID: 24 - CAB-A02 (AUTO, Planta Baja, Disponible)
-- - Spot ID: 25 - CAB-A03 (AUTO, Planta Baja, Ocupado)
-- - Spot ID: 26 - CAB-A04 (AUTO, Piso 1, Disponible, Prioridad Reserva)
-- - Spot ID: 27 - CAB-M01 (MOTO, Planta Baja, Disponible)
-- - Spot ID: 28 - CAB-M02 (MOTO, Planta Baja, Disponible)
-- - Spot ID: 29 - CAB-C01 (CAMIONETA, Planta Baja, Disponible)
-- - Spot ID: 30 - CAB-C02 (CAMIONETA, Planta Baja, Ocupado)

-- Actividad de Laura Fernández:
-- Reservas programadas:
-- - Reservation ID: 6 - Spot ID: 23 (LAU001) - Estado: PENDING
-- - Reservation ID: 7 - Spot ID: 24 (LAU002) - Estado: CONFIRMED

-- Estancias walk-in:
-- - Walk-in ID: 4 - Spot ID: 23 (LAU001) - Estado: COMPLETED
-- - Walk-in ID: 5 - Spot ID: 24 (LAU002) - Estado: ACTIVE

-- Reseñas realizadas:
-- - Review ID: 7 - Parking Lot ID: 3 - Rating: 5
-- - Review ID: 8 - Parking Lot ID: 3 - Rating: 4

-- Incidentes reportados:
-- - Incident ID: 5 - Walk-in ID: 4 - Estado: RESOLVED
-- - Incident ID: 6 - Walk-in ID: 5 - Estado: IN_PROGRESS
