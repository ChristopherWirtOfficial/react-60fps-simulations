import { ProjectileAtomFamily } from 'atoms/Projectiles/ProjectileAtomFamily';
import { ENEMY_SPAWN_PADDING, TILE_SIZE } from 'helpers/knobs';
import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';

import { gridToReal, TileGridEnemyAtomFamily, TileGridEnemyIDList } from './TileGridEnemyAtoms';

const TILE_DIAGONAL = Math.sqrt(TILE_SIZE + (2 * ENEMY_SPAWN_PADDING));

// A selector family for each projectile which gives it the list of enemies in its neighborhood
const ProjectileTileGridEnemySelectorFamily = atomFamily((projectileKey: string) => atom(get => {
  const { x, y, direction } = get(ProjectileAtomFamily(projectileKey));

  // One tile's diagonal in the direction of the projectile's movement from the current x,y
  const neighborhoodCenter = {
    x: x + Math.cos(direction) * TILE_DIAGONAL,
    y: y + Math.sin(direction) * TILE_DIAGONAL,
  };

  const enemyKeys = get(TileGridEnemyIDList);
  const nearbyEnemies = enemyKeys.filter(enemy => {
    const { gridX, gridY } = enemy;
    const { realX, realY } = gridToReal(gridX, gridY);

    // If the enemy is within half a tile from the neighborhood center, it's in the neighborhood
    return Math.abs(realX - neighborhoodCenter.x) < (TILE_SIZE + 2 * ENEMY_SPAWN_PADDING) &&
      Math.abs(realY - neighborhoodCenter.y) < (TILE_SIZE + 2 * ENEMY_SPAWN_PADDING);
  });

  return nearbyEnemies.map(tileId => get(TileGridEnemyAtomFamily(tileId)));
}));

export default ProjectileTileGridEnemySelectorFamily;
