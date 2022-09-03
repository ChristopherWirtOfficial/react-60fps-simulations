import React from 'react';

import { ChakraProvider } from '@chakra-ui/react';
import DrawTest from './tests/DrawTest';


function App() {
  return (
    <ChakraProvider>
      <DrawTest />
    </ChakraProvider>
  );
}

export default App;
