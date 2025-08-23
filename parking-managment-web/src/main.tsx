import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import './shared/ui/styles.css';
import { store, initializeAuth } from './stores/store';
import { router } from './shared/routing/router';
import { AuthInitializer } from './features/auth/components/AuthInitializer';
import { ErrorBoundary } from './shared/components/ErrorBoundary';

const container = document.getElementById('root');
if (!container) throw new Error('Root container not found');
const root = createRoot(container);

// Initialize auth from stored tokens
initializeAuth();

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <AuthInitializer />
        <RouterProvider router={router} />
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>
);


