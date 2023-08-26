import { Text, VStack } from '@chakra-ui/react';
import useTick from 'hooks/useTick';
import React from 'react';


const WidgetDemo: React.FC = () => {
  // const [ stepInterval, setStepInterval ] = useAtom(currentInterval);
  // const [ r, setR ] = useAtom(rFactor);

  // const total = useAtomValue(totalWidgetsProduced);
  // const totalCycles = useAtomValue(totalCyclesCompleted);
  // const nextValue = useAtomValue(nextProductionAmountAtom);
  // const nextCycleTime = useAtomValue(nextProductionTime);
  // const performCycle = useSetAtom(produceWidget);

  useTick(() => {
    console.log('tick tick?');
  });

  // console.log({
  //   stepInterval,
  //   r,
  //   total,
  //   totalCycles,
  //   nextValue,
  //   nextCycleTime,
  // });

  return (
    <VStack>
      <Text>Widget Demo</Text>
    </VStack>
  );
};

export default WidgetDemo;
