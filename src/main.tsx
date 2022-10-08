import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

// '!' at the end to tell Typescript that we know this will be defined and not null
const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  // NOTE: I think it's genuinely too important to have good error messages to not use strict mode
  // NOTE: I ALSO think it's genuinely too important to not double-render literally everything to use strict mode.
  // <React.StrictMode>
  <App />,
  // </React.StrictMode>,
);
