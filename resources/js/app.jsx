import './bootstrap';

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App';

const rootElement = document.getElementById('app');

if (rootElement) {
    const root = createRoot(rootElement);
    root.render(<App />);
}
