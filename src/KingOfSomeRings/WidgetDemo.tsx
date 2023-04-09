import {
  Box, CircularProgress, FormControl, FormLabel, HStack, Input, Text, VStack,
} from '@chakra-ui/react';
import useTick from 'hooks/useTick';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import React, { useState } from 'react';

import {
  currentInterval,
  nextProductionAmountAtom,
  nextProductionTime,
  produceWidget,
  rFactor,
  totalCyclesCompleted,
  totalWidgetsProduced,
} from './widgetDemoAtoms';

const WidgetMachineDemo: React.FC = () => {
  // const [ stepInterval, setStepInterval ] = useAtom(currentInterval);
  // const [ r, setR ] = useAtom(rFactor);

  // const total = useAtomValue(totalWidgetsProduced);
  // const totalCycles = useAtomValue(totalCyclesCompleted);
  // const nextValue = useAtomValue(nextProductionAmountAtom);
  // const nextCycleTime = useAtomValue(nextProductionTime);
  // const performCycle = useSetAtom(produceWidget);

  useTick(() => {
    // performCycle();
    console.log('asdfdasfasdf');
  });


  // const [ remainingTime, setRemainingTime ] = useState(nextCycleTime - Date.now());
  // useTick(() => {
  //   setRemainingTime(nextCycleTime - Date.now());
  // });

  // console.log({
  //   stepInterval,
  //   r,
  //   total,
  //   totalCycles,
  //   nextValue,
  //   nextCycleTime,
  //   remainingTime,
  // });

  // return (
  //   <VStack>
  //     <Box>
  //       <Text fontSize='xl' fontWeight='bold'>
  //         Widget Machine Demo
  //       </Text>
  //     </Box>
  //     <HStack>
  //       <FormControl>
  //         <FormLabel>Step interval (seconds)</FormLabel>
  //         <Input
  //           type='number'
  //           value={ stepInterval }
  //           onChange={ e => setStepInterval(parseFloat(e.target.value)) }
  //         />
  //       </FormControl>
  //       <FormControl>
  //         <FormLabel>Scaling factor (r)</FormLabel>
  //         <Input
  //           type='number'
  //           value={ r }
  //           onChange={ e => setR(parseFloat(e.target.value)) }
  //         />
  //       </FormControl>
  //     </HStack>
  //     <Box>
  //       <Text fontSize='lg'>
  //         Time until next step: { remainingTime.toFixed(2) } s
  //       </Text>
  //       <CircularProgress
  //         value={ 100 - (remainingTime / stepInterval) * 100 }
  //         color='teal'
  //         size='50px'
  //       />
  //     </Box>
  //     <VStack alignItems='flex-start' spacing={ 1 }>
  //       <Text>Total widgets produced: { total.toFixed(2) }</Text>
  //       <Text>Number of steps: { totalCycles }</Text>
  //       <Text>Average widgets per step: { (total / totalCycles).toFixed(2) }</Text>
  //       <Text>
  //         Widgets to be produced in next step:{ ' ' }
  //         { ((total / (totalCycles - 1)) ** r).toFixed(2) }
  //       </Text>
  //     </VStack>
  //   </VStack>
  // );

  return null;
};

export default WidgetMachineDemo;
