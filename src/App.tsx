import React, { useState } from 'react';

import { RecoilRoot } from 'recoil';
import Test2 from './tests/Test2';
import DrawTest from './tests/DrawTest';


function App() {
  return (
    <RecoilRoot>
      <div style={ { padding: '1rem', lineHeight: '1.5rem', height: '100vh', width: '100vw' } }>
        <Test2 />
        <div style={ { margin: '20px 0', height: 0, borderTop: '1px solid black' } } />
        <DrawTest />
      </div>
    </RecoilRoot>
  );
}

export default App;
