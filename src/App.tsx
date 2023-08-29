import { Box, ChakraProvider } from '@chakra-ui/react';
import TileMiner from 'TileMiner';
import { FC } from 'react';

const App: FC = () => (
  <ChakraProvider>
    <Box bg='darkslategray' w='100vw' h='100vh' pos='absolute' userSelect='none' />
    <TileMiner />
  </ChakraProvider>
);

export default App;
