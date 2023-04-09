import { Box } from '@chakra-ui/react';
import { FC } from 'react';
import useTick from 'hooks/useTick';
import WidgetMachineDemo from './WidgetDemo';

const useGame = () => {

};

const KingOfSomeRingsGame: FC = () => {
  console.log('blah blah blah');
  useTick(() => {
    console.log('asdfdasfasdf');
  });

  return (
    <Box>
      { /* <WidgetMachineDemo /> */ }
    </Box>
  );
};

export default KingOfSomeRingsGame;
