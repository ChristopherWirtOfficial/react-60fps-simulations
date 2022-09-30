import { atom } from 'jotai';

export const ScreenNodeAtom = atom<HTMLDivElement | null>(null);

// Viewport Camera position is defined in game coordinates, not screen coordinates
export const ViewportCameraAtom = atom({ x: 0, y: 0, zoom: 1 });

export const ScreenDimensionsSelector = atom(get => {
  const viewportCamera = get(ViewportCameraAtom);
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
    x: viewportCamera.x - screen.width / 2,
    y: viewportCamera.y - screen.height / 2,
    width: screen.width,
    height: screen.height,
  };

  return {
    ...screen,
    center,
    viewportCamera,
    viewport: currentViewportBounds,
  };
});
