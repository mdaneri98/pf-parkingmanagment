-- =============================================
-- ESQUEMA DE BASE DE DATOS H2
-- Sistema de Gestión de Estacionamientos
-- =============================================

-- Tabla de detalles de usuario
CREATE TABLE IF NOT EXISTS user_detail (
                                           id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                           phone VARCHAR(20),
    address VARCHAR(255),
    lang VARCHAR(20) DEFAULT 'en',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- Tabla de usuarios comunes
CREATE TABLE IF NOT EXISTS common_user (
                                           id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                           first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    image_url VARCHAR(500),
    user_detail_id BIGINT UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_user_detail FOREIGN KEY (user_detail_id) REFERENCES user_detail(id)
    );

-- Tabla de gerentes
CREATE TABLE IF NOT EXISTS manager (
                                       id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                       user_id BIGINT NOT NULL,
                                       created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                       CONSTRAINT fk_manager_user FOREIGN KEY (user_id) REFERENCES common_user(id)
    );

-- Tabla de administradores
CREATE TABLE IF NOT EXISTS admin (
                                     id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                     user_id BIGINT NOT NULL,
                                     created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                     CONSTRAINT fk_admin_user FOREIGN KEY (user_id) REFERENCES common_user(id)
    );

-- Tabla de estacionamientos
CREATE TABLE IF NOT EXISTS parking_lot (
                                           id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                           address VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    image_url VARCHAR(500),
    manager_id BIGINT,
    latitude DECIMAL(9,6) NOT NULL,
    longitude DECIMAL(9,6) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_parking_lot_manager FOREIGN KEY (manager_id) REFERENCES manager(id)
    );

-- Tabla de espacios
CREATE TABLE IF NOT EXISTS spot (id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                    vehicle_type VARCHAR(30) NOT NULL,
    floor INTEGER NOT NULL,
    code VARCHAR(20) NOT NULL,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    is_reservable BOOLEAN DEFAULT FALSE,
    is_accessible BOOLEAN DEFAULT FALSE,
    parking_lot_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_spot_parking_lot FOREIGN KEY (parking_lot_id) REFERENCES parking_lot(id)
    );

-- Tabla de precios
CREATE TABLE IF NOT EXISTS parking_price (
                                             id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                             vehicle_type VARCHAR(30) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    valid_from TIMESTAMP NOT NULL,
    valid_to TIMESTAMP,
    parking_lot_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_parking_price_parking_lot FOREIGN KEY (parking_lot_id) REFERENCES parking_lot(id)
    );

-- Tabla de vehículos
CREATE TABLE IF NOT EXISTS vehicle (
    license_plate VARCHAR(20) PRIMARY KEY,
    brand VARCHAR(50),
    model VARCHAR(50),
    type VARCHAR(30),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- Tabla de asignaciones usuario-vehículo
CREATE TABLE IF NOT EXISTS user_vehicle_assignment (
                                                       user_id BIGINT NOT NULL,
                                                       vehicle_license_plate VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, vehicle_license_plate),
    spot_code_snapshot VARCHAR(20),
    spot_floor_snapshot INT,
    CONSTRAINT fk_user_vehicle_user FOREIGN KEY (user_id) REFERENCES common_user(id),
    CONSTRAINT fk_user_vehicle_vehicle FOREIGN KEY (vehicle_license_plate) REFERENCES vehicle(license_plate)
    );

-- Tabla de reservas programadas
CREATE TABLE IF NOT EXISTS scheduled_reservation (
                                                     id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                                     reserved_start_time TIMESTAMP NOT NULL,
                                                     expected_end_time TIMESTAMP NOT NULL,
                                                     status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    estimated_price DECIMAL(10,2) NOT NULL,
    spot_id BIGINT,
    user_id BIGINT NOT NULL,
    vehicle_license_plate VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    spot_code_snapshot VARCHAR(20),
    spot_floor_snapshot INT,
    CONSTRAINT fk_scheduled_reservation_spot FOREIGN KEY (spot_id) REFERENCES spot(id) ON DELETE SET NULL,
    CONSTRAINT fk_scheduled_reservation_assignment FOREIGN KEY (user_id, vehicle_license_plate) REFERENCES user_vehicle_assignment(user_id, vehicle_license_plate)
    );

-- Tabla de estancias walk-in
CREATE TABLE IF NOT EXISTS walk_in_stay (
                                            id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                            check_in_time TIMESTAMP NOT NULL,
                                            check_out_time TIMESTAMP,
                                            total_price DECIMAL(10,2),
    status VARCHAR(20) NOT NULL,
    spot_id BIGINT,
    user_id BIGINT NOT NULL,
    vehicle_license_plate VARCHAR(20) NOT NULL,
    expected_end_time TIMESTAMP,
    spot_code_snapshot VARCHAR(20),
    spot_floor_snapshot INT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_walk_in_stay_spot FOREIGN KEY (spot_id) REFERENCES spot(id) ON DELETE SET NULL,
    CONSTRAINT fk_walk_in_stay_assignment FOREIGN KEY (user_id, vehicle_license_plate) REFERENCES user_vehicle_assignment(user_id, vehicle_license_plate)
    );

-- Tabla de refresh tokens
CREATE TABLE IF NOT EXISTS refresh_token (
                                             id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                             token VARCHAR(255) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    revoked BOOLEAN NOT NULL DEFAULT FALSE,
    replaced_by_token VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_refresh_token_user FOREIGN KEY (user_id) REFERENCES common_user(id)
    );

-- Tabla de reseñas
CREATE TABLE IF NOT EXISTS review (
                                      id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                      rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment VARCHAR(1000),
    user_id BIGINT NOT NULL,
    parking_lot_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_review_user FOREIGN KEY (user_id) REFERENCES common_user(id),
    CONSTRAINT fk_review_parking_lot FOREIGN KEY (parking_lot_id) REFERENCES parking_lot(id)
    );

-- Tabla de incidentes
CREATE TABLE IF NOT EXISTS incident (
                                        id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                        description VARCHAR(1000) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'REPORTED',
    walk_in_stay_id BIGINT,
    scheduled_reservation_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_incident_walk_in_stay FOREIGN KEY (walk_in_stay_id) REFERENCES walk_in_stay(id),
    CONSTRAINT fk_incident_scheduled_reservation FOREIGN KEY (scheduled_reservation_id) REFERENCES scheduled_reservation(id)
    );

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_common_user_email ON common_user(email);
CREATE INDEX IF NOT EXISTS idx_spot_parking_lot ON spot(parking_lot_id);
CREATE INDEX IF NOT EXISTS idx_spot_available ON spot(is_available);
CREATE INDEX IF NOT EXISTS idx_parking_price_parking_lot ON parking_price(parking_lot_id);
CREATE INDEX IF NOT EXISTS idx_parking_price_valid_from ON parking_price(valid_from);
CREATE INDEX IF NOT EXISTS idx_scheduled_reservation_spot ON scheduled_reservation(spot_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_reservation_user ON scheduled_reservation(user_id);
CREATE INDEX IF NOT EXISTS idx_walk_in_stay_spot ON walk_in_stay(spot_id);
CREATE INDEX IF NOT EXISTS idx_walk_in_stay_user ON walk_in_stay(user_id);
CREATE INDEX IF NOT EXISTS idx_review_parking_lot ON review(parking_lot_id);
CREATE INDEX IF NOT EXISTS idx_review_user ON review(user_id);