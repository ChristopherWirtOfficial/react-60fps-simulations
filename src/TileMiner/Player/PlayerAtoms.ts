import { ScreenDimensionsSelector } from 'atoms/Screen/ScreenNodeAtom';
import { TILE_SIZE } from 'helpers/knobs';
import { atom } from 'jotai';
import { TileMinerPlayer } from 'types/TileMinerPlayer';

export const PlayerAtom = atom<TileMinerPlayer>({
  key: 'player',
  x: 0,
  y: 0,
  size: TILE_SIZE,
  color: 'blue',
  damage: 1,
  attackSpeed: 1,
  firingDirection: 0,
});

// Raw screen coordinates from mouse events
export const LastMouseClickAtom = atom<{ x: number, y: number } | undefined>(undefined);

export const LastMouseClickSelector = atom(get => {
  const lastMouseClick = get(LastMouseClickAtom);
  const { center } = get(ScreenDimensionsSelector);

  if (!lastMouseClick) {
    return undefined;
  }

  return {
    x: lastMouseClick.x - center.x,

    // NOTE: Screen Y is inverted from game Y since the screen's origin is at the top left
    y: center.y - lastMouseClick.y,
  };
});

export const PlayerSelector = atom(get => {
  const player = get(PlayerAtom);
  const { x, y } = player;

  const lastMouseClick = get(LastMouseClickSelector);

  const firingDirectionRad = lastMouseClick ?
    Math.atan2(lastMouseClick.y - y, lastMouseClick.x - x) :
    player.firingDirection ?? 0;

  // Lock in the firing direction to the nearest 45 degrees
  const firingDirection = Math.round(firingDirectionRad / (Math.PI / 4)) * (Math.PI / 4);

  return {
    ...player,
    firingDirection,
  };
});
