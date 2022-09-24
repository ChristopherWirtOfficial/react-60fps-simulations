import { Atom, atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { randomColor, uuid } from 'helpers';
import { Enemy } from 'types/Boxes';
import { ENEMY_SPAWN_PADDING, MAP_SIZE, TILE_SIZE } from 'helpers/knobs';

export const MapSeedAtom = atom(0xB00B1E5);

export interface TileEnemy extends Enemy {
  // Any other properties that are SPECIFIC to tile enemies (maybe none)
  gridX: number;
  gridY: number;
}

export type TileEnemyIdentifer = Pick<TileEnemy, 'key' | 'x' | 'y'>;


const CENTER = Math.ceil(MAP_SIZE / 2);
console.log(CENTER);

// Create a simple 2D array of enemies, without the seed for now
export const TileGridEnemyIDList = atom(get => {
  // Eventually, we'll use the seed to generate the map.
  // COOL: And maybe base all actor's RNG off of their uuid (which would also based on the seed)

  // Make a 2D array of enemies that know where they are in the grid, then flatten it to a list of enemy identifiers
  const enemies: TileEnemyIdentifer[] =
  Array.from(
    { length: MAP_SIZE },
    (_, i) => Array.from({ length: MAP_SIZE }, (__, j) => ({
      key: uuid(),
      x: (i + 1) - CENTER,
      y: (j + 1) - CENTER,
    })),
  ).flat();

  // Remove the center enemy since that's where the player spawns
  const enemiesWithoutCenter = enemies.filter(({ x, y }) => x !== 0 || y !== 0);

  // Remove the enemies that are too close to the center
  const enemiesWithoutCenterOrSpawn = enemiesWithoutCenter.filter(({ x, y }) => {
    // Maybe generalize this more to a specific number of tiles away from the center, currently 1 bc math
    const distanceFromCenter = Math.sqrt(x ** 2 + y ** 2);
    return distanceFromCenter > Math.sqrt(2);
  });

  return enemiesWithoutCenterOrSpawn;
});


export const TileGridEnemyAtomFamily = atomFamily<TileEnemyIdentifer, Atom<TileEnemy>>(({ key, x, y }) => {
  const realX = x * (TILE_SIZE + (x !== 0 ? ENEMY_SPAWN_PADDING : 0));
  const realY = y * (TILE_SIZE + (y !== 0 ? ENEMY_SPAWN_PADDING : 0));

  return atom({
    key,
    x: realX,
    y: realY,
    gridX: x,
    gridY: y,
    speed: 0,
    health: 100,
    maxHealth: 100,
    damage: 0,
    size: TILE_SIZE,
    movementSteps: [],
    color: randomColor(150),
    direction: 0,
  });
});
