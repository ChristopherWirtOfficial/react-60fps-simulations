import { Box } from '@chakra-ui/react';
import { FC } from 'react';
import { atom, useAtomValue } from 'jotai';
import ArrowPositionAtomFamily, { ArrowPosition } from './ScreenIndicators';

const OriginArrowPosition = atom<ArrowPosition>(get => get(ArrowPositionAtomFamily({ x: 0, y: 0 })));

export const OriginArrow: FC = () => {
  const originArrow = useAtomValue(OriginArrowPosition);

  return (
    <ScreenIndicatorArrow { ...originArrow } />
  );
};


const ScreenIndicatorArrow: React.FC<ArrowPosition> = ({ angle, x, y, shown }) => (
  <Box
    opacity={ shown ? 1 : 0 }
    pos='fixed'
    transform={ ` translate(-15px, -10px) translate(${x}px, ${y}px)` }
    left='50%'
    top='50%'
  >
    <Box
      borderLeft='20px solid transparent'
      borderRight='20px solid transparent'
      borderBottom='30px solid slateblue'
      transform={ `rotate(${angle + 90}deg)` }
      position='absolute'
    >
      { /* Left Circle */ }
      <Box
        position='absolute'
        top='15px'
        left='-1px'
        w='20px'
        h='20px'
        bg='black'
        borderRadius='50%'
      />
      { /* Right Circle */ }
      <Box
        position='absolute'
        top='15px'
        right='-1px'
        w='20px'
        h='20px'
        bg='black'
        borderRadius='50%'
      />
    </Box>
  </Box>
);

export default ScreenIndicatorArrow;
