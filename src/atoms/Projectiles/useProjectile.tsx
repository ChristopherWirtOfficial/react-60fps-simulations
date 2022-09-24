import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { ScreenDimensionsSelector } from 'atoms/Screen/ScreenNodeAtom';
import useTick from 'hooks/useTick';
import { useAtomCallback } from 'jotai/utils';
import { Projectile } from 'types/Boxes';
import projectCollision from 'helpers/collisions/projectCollisions';
import checkCollisions from 'helpers/collisions/checkCollisions';
import {
  ProjectileAtomFamily,
  Projectiles,
} from './ProjectileAtomFamily';
import useProjectiles from './useProjectileKeys';
import EnemyListSelector from '../Enemies/EnemyListSelector';
import EnemyIDListAtom from '../Enemies/EnemyIDListAtom';
import useMovement from '../../hooks/Entities/useMovement';

/*
  Manage an individual projectile.
*/
const useProjectileAtom = (key: string) => {
  const [ projectile, setProjectileAtom ] = useAtom(Projectiles(key));
  const { removeProjectile } = useProjectiles();

  return {
    projectile,
    setProjectileAtom,
    removeProjectile,
  };
};

/* Check every few ticks if the projectile is off-screen, and just delete it if it is */
const useDeleteSelfWhenOffscreen = (projectile: Projectile) => {
  const { key, x, y } = projectile;
  const { removeProjectile } = useProjectileAtom(key);

  const isOffscreenThreshold = 2000; // #px offscreen it should be before deleting. Generous and should be.
  const { width: screenWidth, height: screenHeight } = useAtomValue(
    ScreenDimensionsSelector,
  );

  const distanceFromOrigin = Math.sqrt(x * x + y * y);

  const checkOffscreen = () => {
    if (distanceFromOrigin > 1500) {
      console.warn('Yo we got a far one dude (deleting)', projectile);
      removeProjectile(key);
    }
    // if (
    //   x < -isOffscreenThreshold ||
    //   x > screenWidth + isOffscreenThreshold ||
    //   y < -isOffscreenThreshold ||
    //   y > screenHeight + isOffscreenThreshold
    // ) {
    //   console.warn('Projectile offscreen, deleting', projectile);
    //   removeProjectile(key);
    // }
  };

  useTick(checkOffscreen, 5);
};

const useProjectileCheckCollision = (projectile: Projectile) => {
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
const useMove = (projectileOrKey: Projectile | string) => {
  const key =
    typeof projectileOrKey === 'string' ? projectileOrKey : projectileOrKey.key;

  const projectileAtom = ProjectileAtomFamily(key);
  useMovement(projectileAtom);
};


const useJumpToCollision = (projectile: Projectile) => {
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

const useProjectile = (projectileOrKey: Projectile | string) => {
  const key = typeof projectileOrKey === 'string' ? projectileOrKey : projectileOrKey.key;

  const { projectile } = useProjectileAtom(key);

  /* Hooks to perform the really re-usable aspects of the projectile. */
  useMove(projectile);

  // TODO: PICKUP - This idea doesn't really work unless it's much closer to perfect
  //  And it's starting to stress me out now smh
  useJumpToCollision(projectile);

  useDeleteSelfWhenOffscreen(projectile);
  useProjectileCheckCollision(projectile);

  return projectile;
};


export default useProjectile;
