import { atom } from 'jotai';
import { atomFamily, atomWithReset } from 'jotai/utils';

import accelerateProjectile from 'hooks/Entities/movement-steps/accelerateProjectile';
import { uuid } from 'helpers';
import { BASE_PROJECTILE_SPEED, PROJECTILE_SIZE } from '../../knobs';
import { Moveable } from '../../hooks/Entities/useMovement';
import EnemyAtomFamily from '../Enemies/EnemyAtomFamily';

export interface Projectile extends Moveable {
  readonly key: string;
  damage: number;
  color?: string;
  targetKey?: string;
}

export const DefaultProjectile: Projectile = {
  // key: `projectile-${uuid()}`,
  key: 'DEFAULT_PROJECTILE',
  x: 0,
  y: 0,
  speed: BASE_PROJECTILE_SPEED,
  size: PROJECTILE_SIZE,
  damage: 0,
  color: '#000',
  targetKey: undefined,
  direction: 0,
  movementSteps: [accelerateProjectile],
};

// TODO: I should seriously reconsider spawning projecticles by using an atomFamily...

// This holds all of the data except for the target, since it would get stale
export const ProjectileAtomFamily = atomFamily((key: string) => atomWithReset<Projectile>({ ...DefaultProjectile, key }));

// The target is stored in the EnemyAtomFamily, but pulled into the Projectiles selector family to keep it all fresh
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
