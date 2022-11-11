import { ScreenDimensionsLoaded } from 'atoms/InitializationLoading';
import MousePositionAtom from 'atoms/MousePositionAtom';
import { useAtom, useAtomValue } from 'jotai';
import { useEffect } from 'react';

import useAtomicRef from '../../hooks/useAtomicRef';
import { ScreenDimensionsSelector, ScreenNodeAtom } from './ScreenNodeAtom';

// TODO: Get a working throttle and turn this back on (if I ever even need it lol)
// NOTE: The problem is that it was causing MAJOR performance problems when the mouse moved because of too many atom updates
// COOL: Consider making a custom ThrottledAtom type that can only be updated at a certain rate
const useMousePosition = () => {
  const [ { x: mouseX, y: mouseY }, setMousePosition ] = useAtom(MousePositionAtom);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [ setMousePosition ]);

  return {
    mouseX,
    mouseY,
  };
};

// Small bridge between the Mouse hook, the ScreenRef AtomicRef, and the MousePositionAtom
const useScreen = () => {
  const [ callbackRef, node ] = useAtomicRef(ScreenNodeAtom);

  const screenDimensions = useAtomValue(ScreenDimensionsSelector);
  const screenDimensionsLoaded = useAtomValue(ScreenDimensionsLoaded);
  const { mouseX, mouseY } = useMousePosition();

  const { x: screenX, y: screenY } = screenDimensions;

  return {
    screenDimensionsLoaded,
    screenRef: callbackRef, // Mileage may vary lmao this can only get tagged on to an element, not passed to most libraries I guess
    screenNode: node,
    mouseX,
    mouseY,
    screenX,
    screenY,
    ...screenDimensions,

  };
};

export default useScreen;
