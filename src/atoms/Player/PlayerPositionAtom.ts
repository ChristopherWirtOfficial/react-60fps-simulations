import { atom } from 'jotai';
import { PLAYER_SIZE } from '../../knobs';


export type PlayerPosition = {
  x: number;
  y: number;
  size: number;
};

export default atom<PlayerPosition>({
  x: 0,
  y: 0,
  size: PLAYER_SIZE,
});
