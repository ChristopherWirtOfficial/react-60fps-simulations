import { useAtom } from 'jotai';

import PlayerPositionAtom from './PlayerPositionAtom';

const usePlayer = () => {
  const [ playerPosition ] = useAtom(PlayerPositionAtom);

  return {
    playerPosition,
  };
};

export default usePlayer;
