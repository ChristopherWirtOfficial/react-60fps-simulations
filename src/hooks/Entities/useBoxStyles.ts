import { useAtomValue } from 'jotai';
import { ScreenDimensionsSelector } from '../../atoms/Screen/ScreenNodeAtom';


export interface Box {
  key: string; // TODO: Decide if thise key belongs here or in the entity system or something

  x: number;
  y: number;
  size: number;
}

/*
  All Boxes are positioned with cartesian coordinates with the origin at the center of the screen.
*/

const useBoxStyles = <T extends Box>(box: T) => {
  const { center } = useAtomValue(ScreenDimensionsSelector);

  const { x, y, size } = box ?? {};

  // Convert from our cartesian coordinates to CSS coordinates for transform
  const cssX = x + center.x;
  const cssY = y + center.y;

  // Offset the X and Y by half the size of the box
  const trueX = cssX - size / 2;
  const trueY = cssY - size / 2;

  const boxStyles: React.CSSProperties = {
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
