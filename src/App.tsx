import React, { useState } from 'react';

import Test1 from './tests/Test1';
import Test2 from './tests/Test2';
import DrawTest from './tests/DrawTest';


function App() {
  return (
    <div style={ { padding: '1rem', lineHeight: '1.5rem', height: '100vh', width: '100vw' } }>
      <Test2 />
      <div style={ { margin: '20px 0', height: 0, borderTop: '1px solid black' } } />
      <DrawTest />
    </div>
  );
}

export default App;
