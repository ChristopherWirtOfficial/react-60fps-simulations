import { useAtom, useAtomValue } from 'jotai';
import { ScreenDimensionsSelector } from 'atoms/Screen/ScreenNodeAtom';
import useTick from 'hooks/useTick';
import { useAtomCallback, useResetAtom } from 'jotai/utils';
import { Enemy } from 'atoms/Enemies/EnemyAtomFamily';
import {
  Projectile,
  ProjectileAtomFamily,
  Projectiles,
} from './ProjectileAtomFamily';
import useProjectiles from './useProjectiles';
import EnemyListSelector from '../Enemies/EnemyListSelector';
import EnemyIDListAtom from '../Enemies/EnemyIDListAtom';
import useMovement from '../../hooks/Entities/useMovement';

/*
  Manage an individual projectile.
*/
const useProjectileAtom = (key: string) => {
  const [ projectile, setProjectileAtom ] = useAtom(Projectiles(key));

  const resetProjectile = useResetAtom(ProjectileAtomFamily(key));

  const { removeProjectile } = useProjectiles();

  return {
    projectile,
    setProjectileAtom,
    resetProjectile,
    removeProjectile,
  };
};

/* Check every few ticks if the projectile is off-screen, and just delete it if it is */
const useDeleteSelfWhenOffscreen = (projectile: Projectile) => {
  const { key, x, y } = projectile;
  const { resetProjectile, removeProjectile } = useProjectileAtom(key);

  const isOffscreenThreshold = 2000; // #px offscreen it should be before deleting. Generous and should be.
  const { width: screenWidth, height: screenHeight } = useAtomValue(
    ScreenDimensionsSelector,
  );

  const distanceFromOrigin = Math.sqrt(x * x + y * y);

  const checkOffscreen = () => {
    if (distanceFromOrigin > 1500) {
      console.warn('Yo we got a far one dude', projectile);
    }
    if (
      x < -isOffscreenThreshold ||
      x > screenWidth + isOffscreenThreshold ||
      y < -isOffscreenThreshold ||
      y > screenHeight + isOffscreenThreshold
    ) {
      resetProjectile();
      removeProjectile(key);
    }
  };

  useTick(checkOffscreen, 5);
};

const useProjectileCheckCollision = (projectile: Projectile) => {
  const { key } = projectile;
  const { resetProjectile, removeProjectile } = useProjectileAtom(key);

  const enemies = useAtomValue(EnemyListSelector);

  /*
    Get a list of all of the enemies and check for collisions.

    TODO: Everything has up-to-date x, y, width, and height in the atoms, use that
  */

  const removeEnemy = useAtomCallback((get, set, enemyKey: string) => {
    set(EnemyIDListAtom, enemyIDList => enemyIDList.filter(id => id !== enemyKey));
  });

  const checkCollisions = () => {
    const { x, y, size } = projectile;

    // Check all enemies and find the first one that collides with the projectile, if any
    // This is honestly so cheap it's not worth complicating more than this. The only thing better would be to delay
    // the check until more than X number of ticks, X being something like 50% of the simulated ticks before simulated collision.
    const collidedEnemy = enemies.find((enemy: Enemy) => {
      const { x: enemyX, y: enemyY, size: enemySize } = enemy;

      return (
        x + size > enemyX &&
        x < enemyX + enemySize &&
        y + size > enemyY &&
        y < enemyY + enemySize
      );
    });

    if (collidedEnemy) {
      // TODO: COMBAT Real damage calculations here, and probably encapsulate all of this in a COMBAT system

      // Destroy the first enemy we hit
      removeEnemy(collidedEnemy.key);

      resetProjectile();
      removeProjectile(key);
    }
  };

  useTick(checkCollisions);
};

// TODO: PICKUP -- Movement just isn't working at all for projectiles rn
// Pretty basic wrapper around useMovement for this specific projectile
const useMove = (projectileOrKey: Projectile | string) => {
  const key =
    typeof projectileOrKey === 'string' ? projectileOrKey : projectileOrKey.key;

  const projectileAtom = ProjectileAtomFamily(key);
  useMovement(projectileAtom);
};

const useProjectile = (projectileOrKey: Projectile | string) => {
  const key = typeof projectileOrKey === 'string' ? projectileOrKey : projectileOrKey.key;

  const { projectile } = useProjectileAtom(key);

  /* Hooks to perform the really re-usable aspects of the projectile. */
  useMove(projectile);
  useDeleteSelfWhenOffscreen(projectile);
  useProjectileCheckCollision(projectile);

  return projectile;
};


export default useProjectile;
