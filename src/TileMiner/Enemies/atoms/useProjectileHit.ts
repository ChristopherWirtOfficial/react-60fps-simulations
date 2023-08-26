import { atom, useSetAtom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { useCallback } from 'react';
import { Projectile } from 'types/Boxes';
import { compareTileEnemyIdentifiers, TileEnemyIdentifer } from 'types/TileEnemy';

export type TileMinerDudeHit = {
  damage: number;
};

export type ProjectileHit = {
  x: number;
  y: number;
  damage: number;
  timestamp: Date;

  // TODO: SOURCE
  // sourceX: number;
  // sourceY: number;
  // sourceKey: string;
};

// For every enemy, we have a list of projectile hits that have occured
// This is used to communicate the damage to the Enemy, and to
//  calculate damage and show hitsplats on the enemy
export const ProjectileHitsAtomFamily = atomFamily(
  (enemyId: TileEnemyIdentifer) => atom<ProjectileHit[]>([]),
  compareTileEnemyIdentifiers,
);

// TODO: Get this in its own more meaningful place? Maybe not, maybe just .. keep them together lol
export const TileMinerDudeHits = atomFamily(
  (enemyId: TileEnemyIdentifer) => atom<TileMinerDudeHit[]>([]),
  compareTileEnemyIdentifiers,
);

// Adding a hit is super easy in this case.
export const useDudeHits = (enemyId: TileEnemyIdentifer) => {
  const setDudeHit = useSetAtom(TileMinerDudeHits(enemyId));

  const addDudeHit = useCallback((damage: number) => {
    setDudeHit(dudeHits => [ ...dudeHits, { damage } ]);
  }, [ setDudeHit ]);

  return { addDudeHit };
};


export const EnemyDamageTakenAtomFamily = atomFamily((enemyId: TileEnemyIdentifer) => atom(get => {
  const hits = get(ProjectileHitsAtomFamily(enemyId));
  const dudeHits = get(TileMinerDudeHits(enemyId));

  const hitsDamage = hits.reduce((acc, hit) => acc + hit.damage, 0);
  const dudesHitDamage = dudeHits.reduce((acc, hit) => acc + hit.damage, 0);

  return hitsDamage + dudesHitDamage;
}), compareTileEnemyIdentifiers);

type AddProjectileHitArgs = { enemyId: TileEnemyIdentifer, projectile: Projectile };

const AddProjectileHitAtom = atom(null, (get, set, { enemyId, projectile }: AddProjectileHitArgs) => {
  const hit: ProjectileHit = {
    x: projectile.x,
    y: projectile.y,
    damage: projectile.damage,
    timestamp: new Date(),
  };

  set(ProjectileHitsAtomFamily(enemyId), hits => [ ...hits, hit ]);
});

const useProjectileHit = () => {
  const addProjectileHit = useSetAtom(AddProjectileHitAtom);

  return { addProjectileHit };
};

export default useProjectileHit;
