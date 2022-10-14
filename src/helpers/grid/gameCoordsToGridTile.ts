
// Game Coords - The majority of the game is scripted in actual pixel coordinates centered at 0,0
// Grid Tile   - The Tile (in whatever definition that ends up being)

import { TILE_SIZE } from 'helpers/knobs';
import { GameCoords } from 'types/Game';

export type GridTile = {
  gridX: number;
  gridY: number;
};

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
