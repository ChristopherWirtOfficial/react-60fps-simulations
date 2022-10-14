import { atom } from 'jotai';
import { TileMinerPlayer } from 'types/TileMinerPlayer';
import FiringDirectionSelector from './FiringDirectionSelector';
import PlayerAtom from './PlayerAtom';

const PlayerSelector = atom<TileMinerPlayer>(get => {
  const player = get(PlayerAtom);

  const firingDirection = get(FiringDirectionSelector);

  return {
    ...player,
    firingDirection,
  };
});

export default PlayerSelector;
