# Parking Management System

A full-stack parking management system built with Spring Boot and React TypeScript, designed for managing parking lots, spots, reservations, and walk-in stays.

## 🚀 Tech Stack

- **Backend**: Spring Boot 3.5.3, Java 21, PostgreSQL/H2, JWT
- **Frontend**: React 19, TypeScript, Redux Toolkit, Tailwind CSS, Google Maps

## ✨ Core Features

- **Authentication**: JWT-based login with manager role access
- **Parking Lot Management**: Create and manage parking lots with Google Maps integration
- **Spot Management**: Create, edit, and track parking spots by floor and vehicle type
- **Walk-in Stays**: Manage parking sessions with check-in/check-out and time extensions
- **Scheduled Reservations**: View and manage reservations with status tracking
- **Price Management**: Configure pricing by vehicle type (auto, moto, camioneta)
- **Dashboard Analytics**: Real-time KPIs including occupancy rates and revenue tracking
- **License Plate Search**: Quick vehicle search functionality

## 🏗️ Project Structure

```
├── parking-managment-api/    # Spring Boot backend
└── parking-managment-web/    # React frontend
```

## 🚀 Quick Start

### Prerequisites

- Java 21+, Maven 3.6+
- Node.js 18+, npm
- **Docker** (required for backend database services)

### Backend Setup

It is important to have Docker already running on the machine.

```bash
cd parking-managment-api
./run.sh dev  # API available at localhost:8081
```

### Frontend Setup

**Open a new terminal/console and run:**

```bash
cd parking-managment-web
./run.sh dev  # App available at localhost:5173
```

## 🔐 Test Credentials

**Manager Account:**
```
Email: laura.fernandez@outlook.com
Password: password123
Role: Manager (manages 2 parking lots)
```

This account has access to:
- Dashboard with already populated data
- Parking lot management
- Spot management and availability tracking
- Walk-in stays and scheduled reservations
- Price configuration
- License plate search functionality

## 📊 Database

The system uses H2 in-memory database for development (with PostgreSQL for production). Sample data includes:
- 3 parking lots with multiple spots
- Various vehicle types (auto, moto, camioneta, etc)
- Active reservations and walk-in stays
- Price configurations per vehicle type

## 🔧 Development

### Backend Commands
```bash
./run.sh dev         # Run with H2 database (default)
./run.sh local       # Run with PostgreSQL
./run.sh prod        # Run with production settings
```

### Frontend Commands
```bash
npm run dev          # Development server
npm run build        # Production build
npm run lint         # Code linting
npm run type-check   # TypeScript checking
```

## 📚 API Documentation

- **H2 Console**: http://localhost:8081/api/h2-console (dev profile)

## 👥 Authors

Matias Ezequiel Daneri and Desiree Melisa Limachi
