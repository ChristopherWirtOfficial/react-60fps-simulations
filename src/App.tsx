import React, { useState } from 'react';

import { RecoilRoot } from 'recoil';
import Test2 from './tests/Test2';
import DrawTest from './tests/DrawTest';


function App() {
  return (
    <RecoilRoot>
      <DrawTest />
    </RecoilRoot>
  );
}

export default App;
