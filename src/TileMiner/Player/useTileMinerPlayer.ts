import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { LastMouseClickAtom, PlayerSelector } from './PlayerAtoms';

export const useTileMinerClickHandler = () => {
  const setLastMouseClick = useSetAtom(LastMouseClickAtom);

  useEffect(() => {
    const handleMouseUp = (e: MouseEvent) => {
      const { clientX, clientY } = e;

      console.log('MOUSE UP', clientX, clientY);

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
