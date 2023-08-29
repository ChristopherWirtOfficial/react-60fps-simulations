import { TILE_PADDING, TILE_SIZE } from 'helpers/knobs';

const tileGridToReal = (gridX: number, gridY: number) => ({
  realX: gridX * (TILE_SIZE + (gridX !== 0 ? TILE_PADDING : 0)),
  realY: gridY * (TILE_SIZE + (gridY !== 0 ? TILE_PADDING : 0)),
});

export default tileGridToReal;
