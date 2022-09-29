import { ScreenDimensionsLoaded } from 'atoms/InitializationLoading';
import { ScreenDimensionsSelector } from 'atoms/Screen/ScreenNodeAtom';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { useLayoutEffect, useRef } from 'react';
import { TileMinerPlayer } from 'types/TileMinerPlayer';

export const GunTipScreenPositionAtom = atom<{ x: number; y: number } | undefined>(undefined);

// Position of the gun tip in the game's coordinates
export type TileMinerGun = {
  x: number;
  y: number;
};

export const GunTipPositionSelector = atom<TileMinerGun | undefined>(get => {
  const { center } = get(ScreenDimensionsSelector);
  const gunTip = get(GunTipScreenPositionAtom);

  if (!gunTip) {
    return undefined;
  }

  return {
    x: gunTip.x - center.x,

    // NOTE: Screen Y is inverted from game Y since the screen's origin is at the top left
    y: center.y - gunTip.y,
  };
});

// TODO: For now, we're just going to use the player's position as the gun's position.
const useGun = (gun: TileMinerPlayer) => {
  const ref = useRef<HTMLDivElement>(null);
  const screenDimensionsLoaded = useAtomValue(ScreenDimensionsLoaded);
  const setGunTipScreenPosition = useSetAtom(GunTipScreenPositionAtom);


  // I don't think this is perfect, but it's not too bad
  useLayoutEffect(() => {
    if (ref.current && screenDimensionsLoaded) {
      const rect = ref.current.getBoundingClientRect();
      const x = rect.x + rect.width / 2;
      const y = rect.y + rect.height / 2;

      setGunTipScreenPosition({ x, y });
    } else {
      console.warn('No ref.current for guntip');
    }
  }, [ gun, setGunTipScreenPosition, screenDimensionsLoaded ]);

  const gunTipPosition = useAtomValue(GunTipPositionSelector);

  return {
    ref,
    gunTipPosition,
  };
};

export default useGun;
