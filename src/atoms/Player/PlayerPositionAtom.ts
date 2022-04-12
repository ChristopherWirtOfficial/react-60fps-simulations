import { atom } from 'recoil';
import { PLAYER_SIZE } from '../../knobs';


export type PlayerPosition = {
  x: number;
  y: number;
  size: number;
};

export default atom<PlayerPosition>({
  key: 'playerPosition',

  default: {
    x: 0,
    y: 0,
    size: PLAYER_SIZE,
  },
});
