import { useEffect, useMemo } from 'react';
import { useRecoilState } from 'recoil';
import useRecoilRef from '@hooks/useRecoilRef';

import PlayerPositionAtom from './PlayerPositionAtom';

const usePlayer = () => {
  const [ playerPosition ] = useRecoilState(PlayerPositionAtom);

  return {
    playerPosition,
  };
};

export default usePlayer;
