import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

// '!' at the end to tell Typescript that we know this will be defined and not null
const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
