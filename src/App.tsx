import { ChakraProvider } from '@chakra-ui/react';
import useCameraMovement from 'TileMiner/Player/Camera/useCameraMovement';
import useZoom from 'TileMiner/Player/Camera/useZoom';

import TileMiner from './TileMiner';

// import DrawTest from './tests/DrawTest';


function App() {
  // TODO: Consider putting this in a hook that's more isolated from getting re-rendered
  useCameraMovement();
  useZoom();
  console.log('Camera movement hook ran, app re-rendered');

  return (
    <ChakraProvider>
      <TileMiner />
    </ChakraProvider>
  );
}

export default App;
