import { useRef, useEffect, useMemo } from 'react';
import { useRecoilState } from 'recoil';
import useRecoilRef from '../../hooks/useRecoilRef';

import PlayerPositionAtom from './PlayerPositionAtom';
import PlayerPositionNodeAtom from './PlayerPositionNodeAtom';

const usePlayer = () => {
  const [ playerRef, player ] = useRecoilRef(PlayerPositionNodeAtom);
  const [ , setPlayerPosition ] = useRecoilState(PlayerPositionAtom);

  // Get the position of the playerRef div's center
  const getPlayerCenter = () => {
    if (!player) {
      return { x: 0, y: 0 };
    }

    const { width, height } = player.getBoundingClientRect();
    const { offsetTop, offsetLeft } = player;
    return {
      // TODO: This isn't actually right lol. I can't figure it out and it's like 2:22am PDT. I'll fix it later, but it's almost center lmao
      x: offsetLeft - width,
      y: offsetTop - height,
    };
  };
  const playerCenter = useMemo(getPlayerCenter, [ player ]);

  useEffect(() => {
    setPlayerPosition(playerCenter);
  }, [ playerCenter, setPlayerPosition ]);

  return {
    playerRef,
  };
};

export default usePlayer;
