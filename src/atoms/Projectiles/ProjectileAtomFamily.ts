import { atom } from 'jotai';
import { atomFamily, atomWithDefault } from 'jotai/utils';

import { BASE_PROJECTILE_SPEED } from '../../knobs';
import ClosestEnemySelector from '../Enemies/ClosestEnemySelector';
import PlayerPositionAtom from '../Player/PlayerPositionAtom';
import { Moveable } from '../../hooks/Entities/useMovement';
import EnemyAtomFamily, { Enemy } from '../Enemies/EnemyAtomFamily';

export interface Projectile extends Moveable {
  readonly key: string;
  damage: number;
  color?: string;
  targetKey?: string;

  // This doesn't really stop anyone from providing a brand new atom state with an arbitrary target
  readonly target?: Enemy
}

// TODO: I should seriously reconsider spawning projecticles by using an atomFamily...

export const ProjectileAtomFamily = atomFamily((key: string) => atomWithDefault<Projectile>(get => {
  const { x: playerX, y: playerY } = get(PlayerPositionAtom);

  // Select the closest enemy to the player at the time of creation, and home in on it
  const closestEnemy = get(ClosestEnemySelector);

  return {
    key,

    x: playerX,
    y: playerY,
    targetKey: closestEnemy?.key,
    damage: 1,

    speed: BASE_PROJECTILE_SPEED,
    direction: 0,
    size: 10,
  };
}));

export const Projectiles = atomFamily((key: string) => atom<Projectile, Projectile>(get => {
  const projectile = get(ProjectileAtomFamily(key));
  const target = projectile.targetKey ? get(EnemyAtomFamily(projectile.targetKey)) : undefined;

  return {
    ...projectile,
    target,
  };
}, (get, set, updateValue) => {
  set(ProjectileAtomFamily(key), updateValue);
}));

export const ProjectileKeyListAtom = atom<string[]>([]);

export const ProjectileListSelector = atom<Projectile[]>(get => {
  const keyList = get(ProjectileKeyListAtom);
  const projectiles = keyList.map(key => get(ProjectileAtomFamily(key)));

  // Idk why I have to do this, so it must mean something else with they types is wrong
  return projectiles as Projectile[];
});
