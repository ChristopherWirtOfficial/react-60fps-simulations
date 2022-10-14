import { TILE_SIZE } from 'helpers/knobs';
import { atom } from 'jotai';
import { TileMinerPlayer } from 'types/TileMinerPlayer';

type DerivedPlayerProperties = 'firingDirection';

const PlayerAtom = atom<Omit<TileMinerPlayer, DerivedPlayerProperties>>({
  key: 'player',
  x: 0,
  y: 0,
  size: TILE_SIZE,
  color: 'blue',
  damage: 1,
  attackSpeed: 1,
});

export default PlayerAtom;
