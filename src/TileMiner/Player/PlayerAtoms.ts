import { ScreenDimensionsSelector } from 'atoms/Screen/ScreenNodeAtom';
import { FIRING_DIRECTION_LOCK, LOCK_FIRING_DIRECTION, TILE_SIZE } from 'helpers/knobs';
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

  // TODO: FIRING DIRECTION - This is so important and so hard to find lmao. I should move it
  //  I could make an AtomFamily for this, where every possible Player has a firing direction they can pull off of it
  // TODO: PROJECTILE SOURCES - I'll think about this a lot LOT more when I actually have multiple projectile sources lmao
  const firingDirectionRad = lastMouseClick ?
    Math.atan2(lastMouseClick.y - y, lastMouseClick.x - x) :
    player.firingDirection ?? 0;

  const lockAngle = FIRING_DIRECTION_LOCK;

  // Lock in the firing direction to the lockAngle, or don't if that's undefined
  const firingDirection = LOCK_FIRING_DIRECTION ?
    Math.round(firingDirectionRad / lockAngle) * lockAngle :
    firingDirectionRad;

  return {
    ...player,
    firingDirection,
  };
});
