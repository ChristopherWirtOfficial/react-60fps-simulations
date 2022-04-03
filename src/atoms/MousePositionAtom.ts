import { atom } from 'recoil';

interface MousePosition {
  x: number | null;
  y: number | null;
}

export default atom<MousePosition>({
  key: 'mousePosition',

  default: {
    x: null,
    y: null,
  },
});
