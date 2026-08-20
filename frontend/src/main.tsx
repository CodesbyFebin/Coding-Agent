import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Create root container
const root = createRoot(document.getElementById('root') as HTMLElement);

// Render the app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Handle errors
if (module.hot) {
  module.hot.accept();
  module.hot.dispose(() => root.unmount());
}
