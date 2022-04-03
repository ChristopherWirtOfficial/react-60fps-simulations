import { atom } from 'recoil';

export default atom<HTMLDivElement | null>({
  key: 'PlayerPositionNode',
  default: null,
});
