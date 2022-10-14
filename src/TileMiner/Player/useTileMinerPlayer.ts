import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { LastMouseClickAtom } from './FiringDirectionSelector';
import PlayerSelector from './PlayerSelector';

export const useTileMinerClickHandler = () => {
  const setLastMouseClick = useSetAtom(LastMouseClickAtom);

  useEffect(() => {
    const handleMouseUp = (e: MouseEvent) => {
      const { clientX, clientY } = e;

      setLastMouseClick({ x: clientX, y: clientY });
    };
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [ setLastMouseClick ]);
};


export const useTileMiner = () => {
  const player = useAtomValue(PlayerSelector);

  return player;
};
