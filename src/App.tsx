import React from 'react';

import { ChakraProvider } from '@chakra-ui/react';
import TileMiner from './TileMiner';
// import DrawTest from './tests/DrawTest';


function App() {
  return (
    <ChakraProvider>
      <TileMiner />
    </ChakraProvider>
  );
}

export default App;
