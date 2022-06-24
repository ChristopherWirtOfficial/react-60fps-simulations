import { useEffect } from 'react';

import useMouse from '@react-hook/mouse-position';

import { useAtom, useAtomValue } from 'jotai';
import useAtomicRef from '../../hooks/useAtomicRef';
import MousePositionAtom from '../MousePositionAtom';

import { ScreenDimensionsSelector, ScreenNodeAtom } from './ScreenNodeAtom';


const useInitScreen = () => {
  const [{ x: mouseX, y: mouseY }, setMousePosition] = useAtom(MousePositionAtom);
  const [callbackRef, node] = useAtomicRef(ScreenNodeAtom);

  const mouse = useMouse(node);

  useEffect(() => {
    setMousePosition({ x: mouse.x, y: mouse.y });
  }, [setMousePosition, mouse]);

  const screenDimensions = useAtomValue(ScreenDimensionsSelector);


  return {
    screenRef: callbackRef, // Mileage may vary lmao this can only get tagged on to an element, not passed to most libraries I guess
    width: screenDimensions.width,
    height: screenDimensions.height,
    screenX: screenDimensions.x,
    screenY: screenDimensions.y,
    mouseX,
    mouseY,
  };
};

export default useInitScreen;
