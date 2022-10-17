import { ScreenDimensionsSelector } from 'atoms/Screen/ScreenNodeAtom';
import { useAtomValue } from 'jotai';

// TODO: RADIAL - Just needs to be implemented haha
// Based on the old camera and the new camera, determine which enemies are now onscreen and now offscreen
const useEnemiesOnScreen = () => {
  const { camera, width: realWidth, height: realHeight } = useAtomValue(ScreenDimensionsSelector);

  // TODO: Still need to get the "old" camera, or double-store the list of onscreen enemies somewhere
  // I guess that works. If I have a list of onscreen enemies that ONLY THIS ATOM EVER USES
  //  then I can use it every time this hook actually changes with the camera and set the now-offscreen enemies to false
};

export default useEnemiesOnScreen;
