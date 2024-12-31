import './bootstrap';

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App/App';

const rootElement = document.getElementById('app');

if (rootElement) {
    const root = createRoot(rootElement);
    root.render(<App />);
}
