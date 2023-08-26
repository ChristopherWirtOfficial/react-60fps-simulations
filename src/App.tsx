import { ChakraProvider } from '@chakra-ui/react';
import TileMiner from 'TileMiner';
import { FC } from 'react';

const App: FC = () => (
  <ChakraProvider>
    <TileMiner />
  </ChakraProvider>
);

export default App;
