import { atom } from 'jotai';

export const ScreenNodeAtom = atom<HTMLDivElement | null>(null);

export const ScreenDimensionsSelector = atom(get => {
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

  return {
    ...screen,
    center,
  };
});
