import { ScreenDimensionsSelector } from 'atoms/Screen/ScreenNodeAtom';
import { TILE_SIZE } from 'helpers/knobs';
import { atom } from 'jotai';
import { GridTile } from '../Tile/helpers/gameCoordsToGridTile';

type Viewport = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const getVisibleTiles = (viewport: Viewport): GridTile[] => {
  const { x: cameraX, y: cameraY, width, height } = viewport;

  const halfWidth = width / 2;
  const halfHeight = height / 2;

  // Calculate bounding box coordinates
  const topLeftX = cameraX - halfWidth;
  const topLeftY = cameraY - halfHeight;
  const bottomRightX = cameraX + halfWidth;
  const bottomRightY = cameraY + halfHeight;

  // Compute tile indices for bounding box corners
  const topLeftTileIndex = {
    x: Math.floor(topLeftX / TILE_SIZE),
    y: Math.floor(topLeftY / TILE_SIZE),
  };
  const bottomRightTileIndex = {
    x: Math.ceil(bottomRightX / TILE_SIZE),
    y: Math.ceil(bottomRightY / TILE_SIZE),
  };

  // Collect tiles within the bounding box
  const visibleTiles: GridTile[] = [];
  for (let { x: gridX } = topLeftTileIndex; gridX <= bottomRightTileIndex.x; gridX++) {
    for (let { y: gridY } = topLeftTileIndex; gridY <= bottomRightTileIndex.y; gridY++) {
      visibleTiles.push({ gridX, gridY }); // Representing each tile by its grid position
    }
  }

  return visibleTiles;
};

const TilesInViewport = atom(get => {
  const { viewport } = get(ScreenDimensionsSelector);

  return getVisibleTiles(viewport);
});

export default TilesInViewport;
