import { atom } from 'jotai';
import { atomFamily, atomWithDefault } from 'jotai/utils';

import { BASE_PROJECTILE_SPEED } from '../../knobs';
import PlayerPositionAtom from '../Player/PlayerPositionAtom';
import { Moveable } from '../../hooks/Entities/useMovement';
import EnemyAtomFamily from '../Enemies/EnemyAtomFamily';

export interface Projectile extends Moveable {
  readonly key: string;
  damage: number;
  color?: string;
  targetKey?: string;
}

// TODO: I should seriously reconsider spawning projecticles by using an atomFamily...

export const ProjectileAtomFamily = atomFamily((key: string) => atomWithDefault<Projectile>(get => {
  const { x: playerX, y: playerY } = get(PlayerPositionAtom);

  return {
    key,

    x: playerX,
    y: playerY,
    targetKey: undefined,
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
