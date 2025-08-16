import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from './templates/AppLayout';
import LoadingSpinner from './components/atoms/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy-loaded page components
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Authentication = React.lazy(() => import('./pages/Authentication'));
const UserManagement = React.lazy(() => import('./pages/UserManagement'));
const ParkingLotManagement = React.lazy(() => import('./pages/ParkingLotManagement'));
const ParkingLotDetails = React.lazy(() => import('./pages/ParkingLotDetails'));
const SpotManagement = React.lazy(() => import('./pages/SpotManagement'));
const Settings = React.lazy(() => import('./pages/Settings'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

const AppRouter: React.FC = () => {
  return (
    <ErrorBoundary>
      <Routes>
        {/* Public routes */}
        <Route path="/auth" element={
          <Suspense fallback={<LoadingSpinner />}>
            <Authentication />
          </Suspense>
        } />
        
        {/* Protected routes with layout */}
        <Route path="/" element={<AppLayout />}>
          <Route index element={
            <Suspense fallback={<LoadingSpinner />}>
              <Dashboard />
            </Suspense>
          } />
          
          <Route path="users" element={
            <Suspense fallback={<LoadingSpinner />}>
              <UserManagement />
            </Suspense>
          } />
          
          <Route path="parking-lots" element={
            <Suspense fallback={<LoadingSpinner />}>
              <ParkingLotManagement />
            </Suspense>
          } />
          
          <Route path="parking-lots/:id" element={
            <Suspense fallback={<LoadingSpinner />}>
              <ParkingLotDetails />
            </Suspense>
          } />
          
          <Route path="spots" element={
            <Suspense fallback={<LoadingSpinner />}>
              <SpotManagement />
            </Suspense>
          } />
          
          <Route path="settings" element={
            <Suspense fallback={<LoadingSpinner />}>
              <Settings />
            </Suspense>
          } />
        </Route>
        
        {/* Catch all route */}
        <Route path="*" element={
          <Suspense fallback={<LoadingSpinner />}>
            <NotFound />
          </Suspense>
        } />
      </Routes>
    </ErrorBoundary>
  );
};

export default AppRouter;
