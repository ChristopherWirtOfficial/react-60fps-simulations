import { ScreenDimensionsSelector } from 'atoms/Screen/ScreenNodeAtom';
import { randomColor, uuid } from 'helpers';
import tileGridToReal from 'helpers/tile-grid/gridToScreenCoords';
import { MAP_SIZE, TILE_SIZE } from 'helpers/knobs';
import { atom } from 'jotai';
import { atomFamily, atomWithDefault, atomWithReset, RESET } from 'jotai/utils';
import { Enemy } from 'types/Boxes';
import { compareTileEnemyIdentifiers, TileEnemyBase, TileEnemyIdentifer } from 'types/TileEnemy';

import { EnemyDamageTakenAtomFamily, ProjectileHitsAtomFamily } from './useProjectileHit';


export const MapSeedAtom = atom(0xB00B1E5);

const CENTER = Math.ceil(MAP_SIZE / 2);

// Create a simple 2D array of enemies, without the seed for now
export const TileEnemyIDList = atomWithDefault(get => {
  // Eventually, we'll use the seed to generate the map.
  // COOL: And maybe base all actor's RNG off of their uuid (which would also be based on the seed)

  // Make a 2D array of enemies that know where they are in the grid, then flatten it to a list of enemy identifiers
  const enemies: TileEnemyIdentifer[] =
    Array.from(
      { length: MAP_SIZE },
      (_, i) => Array.from({ length: MAP_SIZE }, (__, j) => ({
        key: uuid(),
        gridX: (i + 1) - CENTER,
        gridY: (j + 1) - CENTER,
      })),
    ).flat();

  // Remove the center enemy since that's where the player spawns
  const enemiesWithoutCenter = enemies.filter(({ gridX, gridY }) => gridX !== 0 || gridY !== 0);

  // Remove the enemies that are too close to the center
  const enemiesWithoutCenterOrSpawn = enemiesWithoutCenter.filter(({ gridX, gridY }) => {
    // Maybe generalize this more to a specific number of tiles away from the center, currently 1 bc math
    const distanceFromCenter = Math.sqrt(gridX ** 2 + gridY ** 2);
    return distanceFromCenter > Math.sqrt(2);
  });

  return enemiesWithoutCenterOrSpawn;
});

export const TileGridOnscreenEnemyIDList = atom(get => {
  const enemies = get(TileEnemyIDList);
  const { camera, width: realWidth, height: realHeight } = get(ScreenDimensionsSelector);

  // TODO: This might not be exactly right, or expecially it might not be obviously wrong
  const width = realWidth / camera.zoom;
  const height = realHeight / camera.zoom;

  // Based on the viewport and the enemies' grid positions, determine which enemies are onscreen
  const onscreenEnemies = enemies.filter(({ gridX, gridY }) => {
    const { x, y } = camera;
    const { realX, realY } = tileGridToReal(gridX, gridY);

    // Relativelty easy to see this is working by just drawing a box around the viewport
    //  and seeing which enemies are inside it, especially while on over-cranked zoom levels
    //  compared to what can actually be seen on the screen.
    return (
      realX >= x - width / 2 - TILE_SIZE &&
      realX <= x + width / 2 + TILE_SIZE &&
      realY >= y - height / 2 - TILE_SIZE &&
      realY <= y + height / 2 + TILE_SIZE
    );
  });

  return onscreenEnemies;
});

export const EnemiesWithHits = atom(get => {
  const enemies = get(TileEnemyIDList);

  const enemiesWithHits = enemies.filter(enemyId => {
    const hits = get(ProjectileHitsAtomFamily(enemyId));
    return hits.length > 0;
  });

  return enemiesWithHits;
});


// A pure function that calculates damage on an enemy and returns a new enemy
// Doesn't help solve the problem of mutating the specific enemy that was hit. At all.
export const calculateDamage = <MoveableType extends Enemy>(enemy: MoveableType, damage: number): MoveableType => {
  const newHealth = enemy.health - damage;
  return {
    ...enemy,
    health: newHealth,
  };
};

export const TileEnemyAtomFamily = atomFamily(({ key, gridX, gridY }: TileEnemyIdentifer) => {
  // TODO: If I'm seriously going to stick to the tiles then I can make `Tile` components that know what's in them
  //  So instead of rendering out a bunch of enemies whose centers are in the location of the tile's center,
  //   and using a padding to make that center a little further away from the "edge of the tile", I can place
  //   enemies that still have a size that they totally stick to, but they're rendered by an actual Tile component,
  //   and that's laid out more traditionally with the same absolute position, transform, and grid logic.
  const { realX, realY } = tileGridToReal(gridX, gridY);

  // TODO: PICKUP - Get rid of all of the realX and Y stuff. None of the "Tile" level rendering will know pixels.

  const newEnemy: TileEnemyBase = {
    key,
    x: realX,
    y: realY,
    gridX,
    gridY,
    speed: 0,
    maxHealth: 100,
    damage: 0,
    size: TILE_SIZE,
    movementSteps: [],
    color: randomColor(150),
    direction: 0,
  };

  return atomWithReset(newEnemy);
  // NOTE: We need the compareTileEnemyIdentifiers here because we just want to make sure the identifier is the same, not the same actual object
}, compareTileEnemyIdentifiers);

export const TileEnemySelectorFamily = atomFamily((enemyId: TileEnemyIdentifer) => atom(
  get => {
    const enemyAtom = get(TileEnemyAtomFamily(enemyId));

    const damageTaken = get(EnemyDamageTakenAtomFamily(enemyId));
    const health = enemyAtom.maxHealth - damageTaken;

    const hits = get(ProjectileHitsAtomFamily(enemyId));

    return {
      ...enemyAtom,
      health,
      hits,
    };
  },
  (get, set, newEnemy: TileEnemyBase | typeof RESET) => {
    set(TileEnemyAtomFamily(enemyId), newEnemy);
  },
), compareTileEnemyIdentifiers);

