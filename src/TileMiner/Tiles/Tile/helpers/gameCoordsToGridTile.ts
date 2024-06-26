
// Game Coords - The majority of any game physics/screen events is scripted in actual pixel coordinates centered at 0,0
// Grid Tile   - The Tile (in whatever definition that ends up being)

import { TILE_SIZE } from 'helpers/knobs';
import { GameCoords } from 'types/Game';

export type GridTile = {
  gridX: number;
  gridY: number;

  size?: number;
  key?: string;
};

// NOTE: The way this is set up, even the "padding" of the grid tiles
// is ultimately "inner" margin, and those pixel coordinates will map to
// the appropriate tile, even if the tile wasn't "exactly" clicked.
const gameCoordsToGridTile = (coords: GameCoords): GridTile => {
  const { x, y } = coords;

  const tileGridX = x / TILE_SIZE;
  const tileGridY = y / TILE_SIZE;

  return {
    gridX: Math.floor(tileGridX),
    gridY: Math.floor(tileGridY),
  };
};

export default gameCoordsToGridTile;
