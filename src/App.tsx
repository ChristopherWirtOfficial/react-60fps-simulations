import { ChakraProvider } from '@chakra-ui/react';
import { FC } from 'react';
import KingOfSomeRingsGame from './KingOfSomeRings/KingOfSomeRingsGame';


const AppHooks: FC = () => {
// Uncommenting this causes the entire game to re-render on every frame
// useCameraMovement();
// useZoom();
  const unused = 0;
  return null;
};

const App: FC = () => (
  <ChakraProvider>
    { /* <TileMiner /> */ }
    <KingOfSomeRingsGame />
    <AppHooks />
  </ChakraProvider>
);

export default App;
