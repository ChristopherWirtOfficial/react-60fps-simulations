import { ProjectileAtomFamily } from 'atoms/Projectiles/ProjectileAtomFamily';
import gameCoordsToGridTile from 'helpers/tile-grid/gameCoordsToGridTile';
import { TILE_PADDING, TILE_SIZE } from 'helpers/knobs';
import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { EnemyIsDead } from './HandleEnemyDeath';

import { gridToReal, TileEnemyIDList, TileEnemySelectorFamily } from './TileEnemyAtoms';

const TILE_DIAGONAL = Math.sqrt(TILE_SIZE + (2 * TILE_PADDING));


// A selector family for each projectile which gives it the list of enemies in its neighborhood
const ProjectileTileEnemySelectorFamily = atomFamily((projectileKey: string) => atom(get => {
  const { x, y, direction } = get(ProjectileAtomFamily(projectileKey));

  // One tile's diagonal in the direction of the projectile's movement from the current x,y
  const neighborhoodCenter = {
    x: x + Math.cos(direction) * TILE_DIAGONAL,
    y: y + Math.sin(direction) * TILE_DIAGONAL,
  };

  // Current implementation -- Get all alive enemies and filter them by distance
  // New Implementation -- Based on where we, the projectile, are:
  //  - Get the grid tile position we're on
  //  - Get the grid tile position we're moving towards
  //  - Create a list of enemy keys that are in the tiles between those two positions
  //  - Filter that list by distance
  //  - Return the list of enemy keys

  // The neighborhood is the center of the tile we're moving towards, now in GridTile coords
  const neighborhood = gameCoordsToGridTile(neighborhoodCenter);

  // TODO: This might still not be good enough, because it's still going to be a list of all enemies
  const enemyKeys = get(TileEnemyIDList);
  // Guess which enemyKeys we're likely to hit based on the neighborhood in GridTile coords

  const enemyKeysInNeighborhood = enemyKeys.filter(
    ({ gridX, gridY }) => Math.abs(neighborhood.gridX - gridX) <= 1 && Math.abs(neighborhood.gridY - gridY) <= 1,
  );

  // Now that we have a list of possible enemy keys, only include ones that are alive ofc
  const aliveEnemyKeys = enemyKeysInNeighborhood.filter(enemyKey => !get(EnemyIsDead(enemyKey)));

  // TODO: Do we really need to give the entire enemy object to the projectile? Ever?
  // And if we do, should it be here?
  return aliveEnemyKeys.map(tileId => get(TileEnemySelectorFamily(tileId)));
}));

export default ProjectileTileEnemySelectorFamily;
