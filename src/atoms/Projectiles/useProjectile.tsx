import { ScreenDimensionsSelector } from 'atoms/Screen/ScreenNodeAtom';
import getBoxKey from 'helpers/boxes/getBoxKey';
import checkCollisions from 'helpers/collisions/checkCollisions';
import projectCollision from 'helpers/collisions/projectCollisions';
import useTick from 'hooks/useTick';
import { useAtomValue, useSetAtom } from 'jotai';
import { useAtomCallback } from 'jotai/utils';
import { BoxTypeOrKey, Projectile } from 'types/Boxes';

import useMovement from '../../hooks/Entities/useMovement';
import EnemyIDListAtom from '../Enemies/EnemyIDListAtom';
import EnemyListSelector from '../Enemies/EnemyListSelector';
import { ProjectileAtomFamily } from './ProjectileAtomFamily';
import useProjectileAtom from './useProjectileAtom';


/* Check every few ticks if the projectile is off-screen, and just delete it if it is */
export const useDeleteSelfWhenOffscreen = (projectile: Projectile) => {
  const { key, x, y } = projectile;
  const { removeProjectile } = useProjectileAtom(key);

  const IS_OFFSCREEN_THRESHOLD = 5000; // #px offscreen it should be before deleting. Generous and should be.

  const distanceFromOrigin = Math.sqrt(x * x + y * y);

  const checkOffscreen = () => {
    if (distanceFromOrigin > IS_OFFSCREEN_THRESHOLD) {
      // console.warn('Projectile is more than ', IS_OFFSCREEN_THRESHOLD, 'px away. Self-deleting.', projectile);
      removeProjectile(key);
    }
  };

  useTick(checkOffscreen, 5);
};

// TODO: Too tightly coupled to enemies, should be more generic
export const useProjectileCheckCollision = (projectile: Projectile) => {
  const { key } = projectile;
  const { removeProjectile } = useProjectileAtom(key);

  const enemies = useAtomValue(EnemyListSelector);

  /*
    Get a list of all of the enemies and check for collisions.

    TODO: Everything has up-to-date x, y, width, and height in the atoms, use that
  */

  const removeEnemy = useAtomCallback((get, set, enemyKey: string) => {
    set(EnemyIDListAtom, enemyIDList => enemyIDList.filter(id => id !== enemyKey));
  });

  const checkEnemyCollisions = () => {
    const collidedEnemy = checkCollisions(projectile, enemies);
    if (collidedEnemy) {
      // TODO: COMBAT Real damage calculations here, and probably encapsulate all of this in a COMBAT system

      // Destroy the first enemy we hit
      removeEnemy(collidedEnemy.key);

      // Remove ourselves, duh
      removeProjectile(key);
    }
  };

  useTick(checkEnemyCollisions);
};

// Pretty basic wrapper around useMovement for this specific projectile
export const useProjectileMove = (projectileOrKey: BoxTypeOrKey<Projectile>) => {
  const key = getBoxKey(projectileOrKey);

  const projectileAtom = ProjectileAtomFamily(key);
  useMovement(projectileAtom);
};


export const useJumpToCollision = (projectile: Projectile) => {
  const { key } = projectile;
  const setProjectile = useSetAtom(ProjectileAtomFamily(key));
  const enemies = useAtomValue(EnemyListSelector);

  useTick(() => {
    const collisionPoint = projectCollision(projectile, enemies);
    if (collisionPoint) {
      setProjectile(p => ({ ...p, x: collisionPoint.x, y: collisionPoint.y }));
    }
  });
};


const useProjectile = (projectileOrKey: BoxTypeOrKey<Projectile>) => {
  const key = getBoxKey(projectileOrKey);
  const { projectile } = useProjectileAtom(key);

  /* Hooks to perform the really re-usable aspects of the projectile. */
  useProjectileMove(projectile);

  // TODO: COLLISIONS - This idea doesn't really work unless it's much closer to perfect
  //  And it's starting to stress me out now smh
  useJumpToCollision(projectile);

  useDeleteSelfWhenOffscreen(projectile);
  useProjectileCheckCollision(projectile);

  return projectile;
};


export default useProjectile;
