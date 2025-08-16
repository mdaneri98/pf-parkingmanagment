# API de Gestión de Estacionamiento

Sistema de gestión de estacionamiento desarrollado con Spring Boot que permite administrar usuarios, vehículos, estacionamientos, reservas y estadías.

## 🚀 Características

- **Gestión de Usuarios**: Registro, autenticación y gestión de perfiles
- **Gestión de Vehículos**: Registro y asignación de vehículos a usuarios
- **Gestión de Estacionamientos**: Administración de estacionamientos y espacios
- **Sistema de Reservas**: Reservas programadas y estadías al paso
- **Gestión de Precios**: Configuración de tarifas por tipo de vehículo
- **Sistema de Reviews**: Valoraciones y comentarios de estacionamientos
- **Gestión de Incidentes**: Reporte y seguimiento de incidentes

## 🛠️ Tecnologías Utilizadas

- **Spring Boot 3.5.3**
- **Spring Data JPA**
- **Spring Security**
- **PostgreSQL** (producción)
- **H2 Database** (desarrollo)
- **Maven**
- **Java 21**

## 📋 Prerrequisitos

- Java 21 o superior
- Maven 3.6+
- Docker y Docker Compose (opcional)
- PostgreSQL (para producción)

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd parking-managment-api
```

### 2. Configuración de la base de datos

#### Opción A: Usando Docker Compose (Recomendado para desarrollo)

```bash
# Levantar servicios de base de datos
docker-compose up -d postgres

# Para desarrollo con H2 (memoria)
docker-compose up -d h2

# Para gestión de base de datos (opcional)
docker-compose up -d adminer
```

#### Opción B: PostgreSQL local

1. Instalar PostgreSQL
2. Crear base de datos:
```sql
CREATE DATABASE parking_management;
CREATE USER parking_user WITH PASSWORD 'parking_password';
GRANT ALL PRIVILEGES ON DATABASE parking_management TO parking_user;
```

### 3. Configuración de perfiles

El proyecto incluye diferentes perfiles de configuración:

- **dev**: H2 en memoria (desarrollo rápido)
- **local**: PostgreSQL local
- **prod**: PostgreSQL de producción

#### Para desarrollo con H2:
```bash
mvn spring-boot:run -Dspring.profiles.active=dev
```

#### Para desarrollo con PostgreSQL local:
```bash
mvn spring-boot:run -Dspring.profiles.active=local
```

#### Para producción:
```bash
mvn spring-boot:run -Dspring.profiles.active=prod
```

### 4. Compilar y ejecutar

```bash
# Compilar el proyecto
mvn clean compile

# Ejecutar tests
mvn test

# Ejecutar la aplicación
mvn spring-boot:run
```

## 📊 Estructura de la Base de Datos

### Entidades Principales

1. **User**: Usuarios del sistema
2. **UserDetail**: Información adicional de usuarios
3. **Manager**: Gerentes de estacionamientos
4. **Vehicle**: Vehículos registrados
5. **UserVehicleAssignment**: Asignación usuario-vehículo
6. **ParkingLot**: Estacionamientos
7. **ParkingPrice**: Precios por tipo de vehículo
8. **Spot**: Espacios individuales
9. **Review**: Valoraciones de estacionamientos
10. **ScheduledReservation**: Reservas programadas
11. **WalkInStay**: Estadías al paso
12. **Incident**: Incidentes reportados

## 🔌 Endpoints de la API

### Usuarios
- `GET /api/users` - Listar usuarios
- `POST /api/users` - Crear usuario
- `GET /api/users/{id}` - Obtener usuario
- `PUT /api/users/{id}` - Actualizar usuario
- `DELETE /api/users/{id}` - Eliminar usuario
- `GET /api/users/search?q={term}` - Buscar usuarios

### Estacionamientos
- `GET /api/parking-lots` - Listar estacionamientos
- `POST /api/parking-lots` - Crear estacionamiento
- `GET /api/parking-lots/{id}` - Obtener estacionamiento
- `PUT /api/parking-lots/{id}` - Actualizar estacionamiento
- `DELETE /api/parking-lots/{id}` - Eliminar estacionamiento
- `GET /api/parking-lots/available` - Estacionamientos con espacios disponibles

### Vehículos
- `GET /api/vehicles` - Listar vehículos
- `POST /api/vehicles` - Crear vehículo
- `GET /api/vehicles/{licensePlate}` - Obtener vehículo
- `PUT /api/vehicles/{licensePlate}` - Actualizar vehículo
- `DELETE /api/vehicles/{licensePlate}` - Eliminar vehículo

### Espacios
- `GET /api/spots` - Listar espacios
- `POST /api/spots` - Crear espacio
- `GET /api/spots/available` - Espacios disponibles
- `GET /api/spots/parking-lot/{id}` - Espacios por estacionamiento
- `PATCH /api/spots/{id}/availability` - Cambiar disponibilidad

## 🔧 Configuración de Variables de Entorno

### Para Producción

```bash
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=parking_management
export DB_USER=parking_user
export DB_PASSWORD=parking_password
export JWT_SECRET=your-secure-jwt-secret-key
export JWT_EXPIRATION=86400000
export ALLOWED_ORIGINS=https://yourdomain.com
```

## 🧪 Testing

```bash
# Ejecutar todos los tests
mvn test

# Ejecutar tests con cobertura
mvn test jacoco:report

# Ejecutar tests de integración
mvn verify
```

## 📝 Ejemplos de Uso

### Crear un usuario

```bash
curl -X POST http://localhost:8081/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan.perez@email.com",
    "passwordHash": "password123"
  }'
```

### Crear un estacionamiento

```bash
curl -X POST http://localhost:8081/api/parking-lots \
  -H "Content-Type: application/json" \
  -d '{
    "address": "Av. Corrientes 1234, Buenos Aires",
    "imageUrl": "https://example.com/parking.jpg"
  }'
```

### Crear un vehículo

```bash
curl -X POST http://localhost:8081/api/vehicles \
  -H "Content-Type: application/json" \
  -d '{
    "licensePlate": "ABC123",
    "brand": "Toyota",
    "model": "Corolla",
    "type": "AUTO"
  }'
```

## 🐳 Docker

### Construir imagen

```bash
docker build -t parking-management-api .
```

### Ejecutar con Docker

```bash
docker run -p 8081:8081 \
  -e SPRING_PROFILES_ACTIVE=prod \
  -e DB_HOST=host.docker.internal \
  parking-management-api
```

## 📚 Documentación Adicional

- **H2 Console**: http://localhost:8081/h2-console (perfil dev)

## 👥 Autores

- **Equipo de Desarrollo** - *Trabajo inicial* - Matias Ezequiel Daneri y Desiree Melisa Limachi
