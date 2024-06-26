import { BoxProps } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';
import { Box } from 'types/Boxes';

import { ScreenDimensionsSelector } from '../../atoms/Screen/ScreenNodeAtom';

/*
  All Boxes are positioned with cartesian PIXEL coordinates with the origin at the center of the screen.
*/
export const useBoxPositioning = <T extends Box>(box: T) => {
  const { center } = useAtomValue(ScreenDimensionsSelector);
  const { x, y, size } = box ?? {};

  // Convert from our cartesian coordinates to CSS coordinates for transform
  const cssX = x + center.x;
  const cssY = center.y - y;

  // Offset the X and Y by half the size of the box
  const trueX = cssX - size / 2;
  const trueY = cssY - size / 2;

  return {
    trueX,
    trueY,
    cssX,
    cssY,
  };
};

const useBoxStyles = <T extends Box>(box: T) => {
  const { trueX, trueY } = useBoxPositioning(box);
  const { size } = box ?? {};

  const boxStyles: BoxProps = {
    position: 'absolute',
    width: `${size}px`,
    height: `${size}px`,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    transform: `translate(${trueX}px, ${trueY}px)`,
  };

  return boxStyles;
};

export default useBoxStyles;
