import { ScreenDimensionsSelector } from 'atoms/Screen/ScreenNodeAtom';
import { atom } from 'jotai';
import PlayerAtom from './PlayerAtom';

// Raw screen coordinates from mouse events
export const LastMouseClickAtom = atom<{ x: number, y: number } | undefined>(undefined);

export const LastMouseClickSelector = atom(get => {
  const lastMouseClick = get(LastMouseClickAtom);
  const { center } = get(ScreenDimensionsSelector);

  if (!lastMouseClick) {
    return undefined;
  }

  // TODO: This ignores the camera pan and zoom
  //  It's converting directly from screen coordinates to "game" coordinates by subtracting the center

  return {
    x: lastMouseClick.x - center.x,

    // NOTE: Screen Y is inverted from game Y since the screen's origin is at the top left
    y: center.y - lastMouseClick.y,
  };
});

const FiringDirectionSelector = atom(get => {
  const lastMouseClick = get(LastMouseClickSelector);
  const { x, y } = get(PlayerAtom);

  if (!lastMouseClick) {
    return 0;
  }

  return Math.atan2(lastMouseClick.y - y, lastMouseClick.x - x);
});

export default FiringDirectionSelector;
