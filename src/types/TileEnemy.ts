import { ProjectileHit } from 'TileMiner/Enemies/atoms/useProjectileHit';
import { Enemy } from './Boxes';

export interface TileEnemy extends Enemy {
  // Any other properties that are SPECIFIC to tile enemies (maybe none)
  gridX: number;
  gridY: number;
  hits: ProjectileHit[];
}

export type TileEnemyBase = Omit<TileEnemy, 'health' | 'hits'>;

export type TileEnemyIdentifer = Pick<TileEnemy, 'key' | 'gridX' | 'gridY'>;

export const compareTileEnemyIdentifiers =
  (a: TileEnemyIdentifer, b: TileEnemyIdentifer) => a.key === b.key && a.gridX === b.gridX && a.gridY === b.gridY;
