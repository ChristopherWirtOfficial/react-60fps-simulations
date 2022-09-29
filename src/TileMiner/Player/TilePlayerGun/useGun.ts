import { ScreenDimensionsSelector } from 'atoms/Screen/ScreenNodeAtom';
import { atom, useSetAtom } from 'jotai';
import { useCallback, useLayoutEffect, useRef } from 'react';
import { TileMinerPlayer } from 'types/TileMinerPlayer';

const GunTipScreenPositionAtom = atom<{ x: number; y: number } | undefined>(undefined);

export const GunTipPositionSelector = atom(get => {
  const { center } = get(ScreenDimensionsSelector);
  const gunTip = get(GunTipScreenPositionAtom);

  if (!gunTip) {
    return undefined;
  }

  return {
    x: gunTip.x - center.x,
    y: gunTip.y - center.y,
  };
});
// TODO: For now, we're just going to use the player's position as the gun's position.
const useGun = (gun: TileMinerPlayer) => {
  const ref = useRef<HTMLDivElement>(null);

  const setGunTipScreenPosition = useSetAtom(GunTipScreenPositionAtom);

  const setGunTipPosition = useCallback(() => {
    if (!ref.current) {
      return;
    }

    const rect = ref.current.getBoundingClientRect();
    const x = rect.x + rect.width / 2;
    const y = rect.y + rect.height / 2;

    setGunTipScreenPosition({ x, y });
  }, [ setGunTipScreenPosition ]);

  // TODO: How the fuck do you get the position of the gun tip the first time?
  useLayoutEffect(() => {
    setGunTipPosition();
  }, [ gun.firingDirection, setGunTipPosition ]);

  return {
    ref,
  };
};

export default useGun;
