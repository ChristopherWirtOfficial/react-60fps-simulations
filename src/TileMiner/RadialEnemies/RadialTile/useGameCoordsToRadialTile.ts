// A bridge from Game X, Y coordinates to the Radial Tile coordinates
import useScreen from 'atoms/Screen/useScreen';
import { FULL_TILE_HEIGHT, RadialTileCoords, ringInfo } from 'TileMiner/Enemies/atoms/radialTiles';
import { GameCoords, ScreenCoords } from 'types/Game';


const useGameCoords = (screenCoords: ScreenCoords) => {
  const { x, y } = screenCoords;

  // TODO: The useScreen hook (or its underlying hooks) need to be refactored to be singletons
  //  If I want to have a single useScreen hook, only one of them should actually initialize anything.
  //   I may be able to rely on Jotai atoms, or maybe more outside of React, to make this work.
  const { center } = useScreen();

  return {
    x: x - center.x,
    y: y - center.y,
  } as GameCoords;
};

// TODO: I think it makes more sense to keep more of this in Jotai
//  and have an atom factory that produces screen -> game coords, game -> radial coords, and their inverses
//  But for this testing rn, this is plenty good

export const useMouseGameCoords = () => {
  const { mouseX, mouseY } = useScreen();

  return useGameCoords({ x: mouseX!, y: mouseY! });
};

// TODO: PICKUP - Refactor this to be Jotai based
const useGameCoordsToRadialTiles = (coords: GameCoords) => {
  // Figure out which ring the coords are in, based on distance from the
  //   center and the Tile Height / Ring "Height"

  // Figure out which tile in the ring the coords are in, based on the
  //   angle of the coords and the Tile Width
  const { x, y } = coords;

  // Normalize the angle between 0 and 2PI
  const angle = Math.atan2(-y, x);
  const distance = Math.sqrt(x * x + y * y);

  // Which "ring" it's in. This includes the padding between rings, and so needs to be accounted for
  // I think there should be two versions of this:
  //   - one that gets the "ring" and "index" without considering
  //      if the coords are in the padding on the edges
  //   - one that gets the actual tile that's there, or null if it's in the padding (or center idk)
  const ring = Math.floor(distance / FULL_TILE_HEIGHT);

  // Based on the ring, we can know how many tiles are in the ring
  // Based on knowing how many tiles there are supposed to be, we can figure out which one the angle is in
  const { tileCount } = ringInfo(ring);

  // We normalize the angle to be between 0 and 2PI going counter-clockwise like normal
  const normalizedAngle = angle < 0 ? angle + 2 * Math.PI : angle;
  const index = Math.floor(normalizedAngle / (2 * Math.PI) * tileCount);

  return {
    ring,
    index,
  } as RadialTileCoords;
};

export default useGameCoordsToRadialTiles;
