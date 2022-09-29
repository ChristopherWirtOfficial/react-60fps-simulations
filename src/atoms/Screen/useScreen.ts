import { ScreenDimensionsLoaded } from 'atoms/InitializationLoading';
import { useAtomValue } from 'jotai';

import useAtomicRef from '../../hooks/useAtomicRef';
import { ScreenDimensionsSelector, ScreenNodeAtom } from './ScreenNodeAtom';

// TODO: Get a working throttle and turn this back on (if I ever even need it lol)
// NOTE: The problem is that it was causing MAJOR performance problems when the mouse moved because of too many atom updates
// COOL: Consider making a custom ThrottledAtom type that can only be updated at a certain rate
// const useMousePosition = () => {
//   const [ { x: mouseX, y: mouseY }, setMousePosition ] = useAtom(MousePositionAtom);

//   useEffect(() => {
//     const handleMouseMove = throttle((event: MouseEvent) => {
//       setMousePosition({ x: event.clientX, y: event.clientY });
//       console.log('mouse move', event.clientX, event.clientY);
//     }, 100);
//     window.addEventListener('mousemove', handleMouseMove);
//     return () => {
//       window.removeEventListener('mousemove', handleMouseMove);
//     };
//   }, [ setMousePosition ]);

//   return {
//     mouseX,
//     mouseY,
//   };
// };

// Small bridge between the Mouse hook, the ScreenRef AtomicRef, and the MousePositionAtom
const useInitScreen = () => {
  const [ callbackRef, node ] = useAtomicRef(ScreenNodeAtom);

  const screenDimensions = useAtomValue(ScreenDimensionsSelector);
  const screenDimensionsLoaded = useAtomValue(ScreenDimensionsLoaded);
  // const { mouseX, mouseY } = useMousePosition();

  return {
    screenDimensionsLoaded,
    screenRef: callbackRef, // Mileage may vary lmao this can only get tagged on to an element, not passed to most libraries I guess
    width: screenDimensions.width,
    height: screenDimensions.height,
    screenX: screenDimensions.x,
    screenY: screenDimensions.y,
    // mouseX,
    // mouseY,
  };
};

export default useInitScreen;
