import { atom } from 'jotai';
import { CameraAtom } from 'TileMiner/Player/Camera/useCamera';

export const ScreenNodeAtom = atom<HTMLDivElement | null>(null);

export const ScreenDimensionsSelector = atom(get => {
  const camera = get(CameraAtom);
  const screenNode = get(ScreenNodeAtom);
  // Get the useful dimensions off of the screen node
  const screen = {
    width: screenNode?.clientWidth ?? 0,
    height: screenNode?.clientHeight ?? 0,
    x: screenNode?.offsetLeft ?? 0,
    y: screenNode?.offsetTop ?? 0,
  };


  const center = {
    x: screen.width / 2,
    y: screen.height / 2,
  };

  const currentViewportBounds = {
    x: camera.x,
    y: camera.y,
    width: screen.width,
    height: screen.height,
  };

  return {
    ...screen,
    center,
    camera,
    viewport: currentViewportBounds,
  };
});
