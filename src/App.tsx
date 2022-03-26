import React, { useState } from 'react';

import Test1 from './tests/Test1';
import Test2 from './tests/Test2';
import Test3 from './tests/Test3';


function App() {
  return (
    <div style={ { padding: '1rem', lineHeight: '1.5rem' } }>
      <Test2 />
      <div style={ { margin: '20px 0', height: 0, borderTop: '1px solid black' } } />
      <Test3 />
    </div>
  );
}

export default App;
