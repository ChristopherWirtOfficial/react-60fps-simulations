import { ScreenDimensionsSelector } from 'atoms/Screen/ScreenNodeAtom';
import { TILE_SIZE } from 'helpers/knobs';
import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { compareTileEnemyIdentifiers, TileEnemyIdentifer } from 'types/TileEnemy';
import { gridToReal, TileGridOnscreenEnemyIDList } from './TileEnemyAtoms';
import { ProjectileHitsAtomFamily } from './useProjectileHit';

// A family that indicates whether an enemy is onscreen or not (for rendering purposes)
const EnemyIsOnscreenAtomFamily = atomFamily((enemyId: TileEnemyIdentifer) => atom(get => {
  const { camera, width: realWidth, height: realHeight } = get(ScreenDimensionsSelector);
  const { gridX, gridY } = enemyId;

  // TODO: This might not be exactly right, or expecially it might not be obviously wrong
  const width = realWidth / camera.zoom;
  const height = realHeight / camera.zoom;

  // Based on the viewport and the enemies' grid positions, determine if this enemy is onscreen
  const { x, y } = camera;
  const { realX, realY } = gridToReal(gridX, gridY);

  // Relativelty easy to see this is working by just drawing a box around the viewport
  //  and seeing which enemies are inside it, especially while on over-cranked zoom levels
  //  compared to what can actually be seen on the screen.
  return (
    realX >= x - width / 2 - TILE_SIZE &&
      realX <= x + width / 2 + TILE_SIZE &&
      realY >= y - height / 2 - TILE_SIZE &&
      realY <= y + height / 2 + TILE_SIZE
  );
}), compareTileEnemyIdentifiers);

// A family that returns whether or not an enemy has been hit by a projectile
const EnemyHasHitsAtomFamily = atomFamily((enemyId: TileEnemyIdentifer) => atom(get => {
  const hits = get(ProjectileHitsAtomFamily(enemyId));
  return hits.length > 0;
}), compareTileEnemyIdentifiers);


// TODO: PICKUP - Re-create the logic in `EnemiesToRender` with atom families the entire way down
// Lets an individal <TileEnemyWrapper> know if it should render or not
const ShouldEnemyRenderAtomFamily = atomFamily((enemyId: TileEnemyIdentifer) => atom(get => {
  const enemyIsOnscreen = get(EnemyIsOnscreenAtomFamily(enemyId));
  const enemyHasHits = get(EnemyHasHitsAtomFamily(enemyId));

  return enemyIsOnscreen || enemyHasHits;
}), compareTileEnemyIdentifiers);

export default ShouldEnemyRenderAtomFamily;
