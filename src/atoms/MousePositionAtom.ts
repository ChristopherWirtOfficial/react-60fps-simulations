import { atom } from 'jotai';
import { atomWithDefault } from 'jotai/utils';

interface MousePosition {
  x: number | null;
  y: number | null;
}

export default atom<MousePosition>({
  x: null,
  y: null,
});
