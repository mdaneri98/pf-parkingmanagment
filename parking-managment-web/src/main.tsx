import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import '@shared/ui/styles.css';
import { store } from '@stores/store';
import { ErrorBoundary } from '@shared/components/ErrorBoundary';
import App from './App';
import '@shared/i18n/config'; // Initialize i18n


const container = document.getElementById('root');
if (!container) throw new Error('Root container not found');
const root = createRoot(container);


root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </Provider>
  </React.StrictMode>
);