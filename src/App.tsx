import { ChakraProvider } from '@chakra-ui/react';
import { FC } from 'react';
import useCameraMovement from 'TileMiner/Player/Camera/useCameraMovement';

import TileMiner from './TileMiner';


const AppHooks: FC = () => {
  useCameraMovement();
  // useZoom();

  return null;
};

const App: FC = () => (
  <ChakraProvider>
    <TileMiner />
    { /* <AppHooks /> */ }
  </ChakraProvider>
);

export default App;
