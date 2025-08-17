# Parking Management System - Frontend

A modern React-based web application for managing parking lots, spots, and user reservations. Built with TypeScript, Redux Toolkit, and Tailwind CSS following atomic design principles.

## 🏗️ Project Structure

```
src
├── assets
├── components
├── features
│   ├── auth
│   │   ├── api
│   │   ├── components
│   │   ├── pages
│   │   ├── selectors
│   │   └── slice
│   └── parkingLots
│       ├── components
│       ├── pages
│       ├── selectors
│       └── slice
├── hooks
├── pages
├── shared
│   ├── config
│   ├── lib
│   ├── routing
│   ├── types
│   └── ui
├── stores
└── templates
```

## 🚀 Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 6.3
- **State Management**: Redux Toolkit + RTK Query
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

2. **Environment Configuration**:
   - Copy `env.development` to `.env.development` for development
   - Copy `env.production` to `.env.production` for production
   - Update API URLs and other settings as needed

3. **Run development server**:
   ```bash
   npm run dev          # Development mode (localhost:8081)
   npm run prod         # Production mode (production API)
   ```

4. **Build for production**:
   ```bash
   npm run build        # Production build
   npm run build:dev    # Development build
   ```

5. **Preview builds**:
   ```bash
   npm run preview      # Preview production build
   npm run preview:dev  # Preview development build
   ```

6. **Code quality**:
   ```bash
   npm run lint         # Lint code
   npm run type-check   # TypeScript type checking
   ```

## 🌍 Environment Configuration

The application supports multiple environments with different configurations:

### Development Environment
- **File**: `.env.development`
- **API**: `http://localhost:8081/api`
- **Features**: Full logging, debug mode, development tools
- **Command**: `npm run dev`

### Production Environment
- **File**: `.env.production`
- **API**: `https://api.parkingmanagement.com/api`
- **Features**: Minimal logging, optimized builds, production settings
- **Command**: `npm run prod`

### Environment Variables
- `VITE_API_BASE_URL`: Backend API base URL
- `VITE_APP_NAME`: Application name
- `VITE_APP_VERSION`: Application version
- `VITE_ENABLE_LOGGING`: Enable/disable logging
- `VITE_ENABLE_DEBUG`: Enable/disable debug features

## 🔐 Authentication System

The application includes a complete authentication system:

- **Login Form**: Email/password authentication
- **Token Management**: JWT access and refresh tokens
- **Protected Routes**: Automatic redirect for unauthenticated users
- **Role-Based Access**: Support for User, Manager, and Admin roles
- **Automatic Logout**: Token expiration handling

## 🏛️ Architecture

- **Atomic Design**: Components organized by complexity level
- **Redux Toolkit**: Centralized state management with TypeScript
- **RTK Query**: API data fetching with caching and synchronization
- **Protected Routing**: Authentication-based route protection
- **Environment Config**: Environment-specific settings and builds
- **Lazy Loading**: Route-based code splitting for performance
- **Type Safety**: Strict TypeScript configuration
- **Error Boundaries**: Graceful error handling
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## 🔧 Development

The project uses modern development practices including:
- Strict TypeScript configuration
- ESLint with React and TypeScript rules
- Environment-specific configurations
- Hot module replacement
- Code splitting and lazy loading
- Proper type definitions for all interfaces
- Comprehensive logging and debugging tools
