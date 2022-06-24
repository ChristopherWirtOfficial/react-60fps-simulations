import { useAtom, useAtomValue } from 'jotai';
import { ScreenDimensionsSelector } from '@atoms/Screen/ScreenNodeAtom';
import useTick from '@hooks/useTick';
import { useAtomCallback, useResetAtom } from 'jotai/utils';
import { Projectile, ProjectileAtomFamily, Projectiles } from './ProjectileAtomFamily';
import useProjectiles from './useProjectiles';
import EnemyListSelector from '../Enemies/EnemyListSelector';
import EnemyIDListAtom from '../Enemies/EnemyIDListAtom';
import useMovement, { Moveable, MovementStep } from '../../hooks/Entities/useMovement';
import EnemyAtomFamily from '../Enemies/EnemyAtomFamily';
import { Box } from '../../hooks/Entities/useBoxStyles';
import { MAX_PROJECTILE_SPEED } from '../../knobs';

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

let first = true;

// Movement step that tracks a target like a heat-seeking missile
// A glorified stepToward vector adjustor
const seekTarget: MovementStep<Projectile> = projectile => {
  const {
    x, y, direction, speed, target, damage,
  } = projectile;

  if (first) {
    console.log('first', projectile);
    first = false;
  }

  // Do whatever you were just doing lol sorry
  if (!target) {
    return projectile;
  }


  // Constantly take the exact angle toward our desired target
  const angleTowardClosestEnemy = Math.atan2(
    target?.y ?? 0 - y,
    target?.x ?? 0 - x,
  );

  const distance = Math.sqrt(
    (target?.x ?? 0 - x) * (target?.x ?? 0 - x) +
    (target?.y ?? 0 - y) * (target?.y ?? 0 - y),
  );

  console.table({
    targetX: target?.x ?? 0,
    targetY: target?.y ?? 0,
    x,
    y,
    speed,
    angleTowardClosestEnemy,
    distance,
  });


  return {
    ...projectile,
    direction: angleTowardClosestEnemy,
  } as Projectile;
};

const accelerate: MovementStep<Projectile> = projectile => {
  const { speed } = projectile;

  return {
    ...projectile,
    speed: Math.min(speed + 0.05 * speed, MAX_PROJECTILE_SPEED),
  };
};


const useMove = (projectileOrKey: Projectile | string) => {
  const key = typeof projectileOrKey === 'string' ? projectileOrKey : projectileOrKey.key;
  const { projectile, setProjectileAtom } = useProjectileAtom(key);
  useMovement(projectile, setProjectileAtom, [ seekTarget, accelerate ]);
};

/* Check every few ticks if the projectile is off-screen, and just delete it if it is */
const useDeleteSelfWhenOffscreen = (projectile: Projectile) => {
  // TODO: Note: is there a way to pull off the 'self' part of this suggestion without a provider?
  // const { projectile, resetProjectile, removeProjectile } = useProjectileAtom('self');

  const { key, x, y } = projectile;
  const { resetProjectile, removeProjectile } = useProjectileAtom(key);

  const isOffscreenThreshold = 200; // #px offscreen it should be before deleting. Generous and should be.
  const { width: screenWidth, height: screenHeight } = useAtomValue(ScreenDimensionsSelector);

  const distanceFromOrigin = Math.sqrt(x * x + y * y);

  const checkOffscreen = () => {
    if (distanceFromOrigin > 1500) {
      console.warn('Yo we got a far one dude', projectile);
    }
    if (
      x < -isOffscreenThreshold || x > screenWidth + isOffscreenThreshold ||
      y < -isOffscreenThreshold || y > screenHeight + isOffscreenThreshold
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

    const collisions = enemies.filter(enemy => {
      const { x: enemyX, y: enemyY, size: enemySize } = enemy;

      return (
        x + size > enemyX &&
        x < enemyX + enemySize &&
        y + size > enemyY &&
        y < enemyY + enemySize
      );
    });

    if (collisions.length > 0) {
      // TODO: COMBAT Real damage calculations here, and probably encapsulate all of this in a COMBAT system

      // Destroy the first enemy we hit
      const enemy = collisions[0];
      removeEnemy(enemy.key);

      resetProjectile();
      removeProjectile(key);
    }
  };

  useTick(checkCollisions);
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
