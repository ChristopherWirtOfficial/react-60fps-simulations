import {
  Box, ChakraProvider, Button, VStack,
} from '@chakra-ui/react';
import react, { FC, useState } from 'react';
import TileMiner from 'TileMiner';
import CircleGravity from './tests/CircleGravity'; // Make sure you rename DrawTest to CircleGravity

// Define the components and their labels
const components = [
  { label: 'Circle Gravity', render: () => <CircleGravity /> },
  { label: 'Tile Miner', render: () => <TileMiner /> },
];

const App: FC = () => {
  // State to hold the currently selected component's render function
  const [ currentComponent, setCurrentComponent ] = useState(() => components[0].render);

  return (
    <ChakraProvider>
      <Box bg='darkslategray' w='100vw' h='100vh' pos='absolute' userSelect='none'>
        <VStack spacing={ 4 } position='absolute' top='20px' right='20px' zIndex={ 100000 } alignItems='end'>
          { components.map(comp => (
            <Button key={ comp.label } colorScheme='blue' onClick={ () => setCurrentComponent(() => comp.render) }>
              { comp.label }
            </Button>
          )) }
        </VStack>
        { currentComponent() }
      </Box>
    </ChakraProvider>
  );
};

export default App;
