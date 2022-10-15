import { ENEMY_SPAWN_PADDING, TILE_SIZE } from 'helpers/knobs';

const gridToReal = (gridX: number, gridY: number) => ({
  realX: gridX * (TILE_SIZE + (gridX !== 0 ? ENEMY_SPAWN_PADDING : 0)),
  realY: gridY * (TILE_SIZE + (gridY !== 0 ? ENEMY_SPAWN_PADDING : 0)),
});

export default gridToReal;
