import { useEffect, useMemo } from 'react';
import { useAtom } from 'jotai';
import useAtomicRef from '@hooks/useAtomicRef';

import PlayerPositionAtom from './PlayerPositionAtom';

const usePlayer = () => {
  const [playerPosition] = useAtom(PlayerPositionAtom);

  return {
    playerPosition,
  };
};

export default usePlayer;
