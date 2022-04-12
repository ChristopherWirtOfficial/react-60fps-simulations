import { atom, selector } from 'recoil';

export const ScreenNodeAtom = atom<HTMLDivElement | null>({
  key: 'ScreenNode',
  default: null,
});

export const ScreenDimensionsSelector = selector({
  key: 'ScreenDimentions',
  get: ({ get }) => {
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
  },
});
