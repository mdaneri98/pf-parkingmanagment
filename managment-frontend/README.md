# Parking Management System - Frontend

A modern React-based web application for managing parking lots, spots, and user reservations. Built with TypeScript, Redux Toolkit, and Tailwind CSS following atomic design principles.

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── atoms/           # Basic building blocks (Button, Input, Card)
│   ├── molecules/       # Compound components (SlotCard, SlotModal)
│   ├── organisms/       # Complex components (ParkingGrid)
│   └── ErrorBoundary.tsx
├── pages/               # Route components
│   ├── Dashboard.tsx
│   ├── Authentication.tsx
│   ├── UserManagement.tsx
│   ├── ParkingLotManagement.tsx
│   ├── ParkingLotDetails.tsx
│   ├── ParkingLotProfile.tsx
│   ├── SpotManagement.tsx
│   └── Settings.tsx
├── templates/           # Layout components
│   ├── AppLayout.tsx   # Main application layout
│   └── BaseLayout.tsx  # Base layout wrapper
├── stores/              # Redux store configuration
│   ├── index.ts        # Store setup and types
│   ├── parkingLotSlice.ts
│   └── spotSlice.ts
├── hooks/               # Custom React hooks
│   └── redux.ts        # Typed Redux hooks
├── types/               # TypeScript type definitions
├── utils/               # Utility functions and mock data
└── AppRouter.tsx        # Application routing
```

## 🚀 Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 6.3
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Routing**: React Router v7
- **Forms**: React Hook Form
- **Code Quality**: ESLint + TypeScript ESLint

## 📋 Prerequisites

- Node.js 18+
- npm

## 🛠️ Installation & Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

4. **Lint code**:
   ```bash
   npm run lint
   ```

## 🏛️ Architecture

- **Atomic Design**: Components organized by complexity level
- **Redux Toolkit**: Centralized state management with TypeScript
- **Lazy Loading**: Route-based code splitting for performance
- **Type Safety**: Strict TypeScript configuration
- **Error Boundaries**: Graceful error handling
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## 🔧 Development

The project uses modern development practices including:
- Strict TypeScript configuration
- ESLint with React and TypeScript rules
- Hot module replacement
- Code splitting and lazy loading
- Proper type definitions for all interfaces
