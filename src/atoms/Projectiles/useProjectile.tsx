import { useRecoilState, useRecoilValue, useResetRecoilState, useRecoilCallback } from 'recoil';
import { ScreenDimensionsSelector } from '@atoms/Screen/ScreenNodeAtom';
import useTick from '@hooks/useTick';
import { useEffect } from 'react';
import { Projectile, ProjectileAtomFamily } from './ProjectileAtomFamily';
import useProjectiles from './useProjectiles';
import EnemyListSelector from '../Enemies/EnemyListSelector';
import EnemyIDListAtom from '../Enemies/EnemyIDListAtom';

/*
  Manage an individual projectile.
*/
const useProjectileAtom = (key: string) => {
  const [ projectile, setProjectileAtom ] = useRecoilState(ProjectileAtomFamily(key));
  const resetProjectile = useResetRecoilState(ProjectileAtomFamily(key));
  const { removeProjectile } = useProjectiles();


  return {
    projectile,
    setProjectileAtom,
    resetProjectile,
    removeProjectile,
  };
};

const useMove = (projectileOrKey: Projectile | string) => {
  const key = typeof projectileOrKey === 'string' ? projectileOrKey : projectileOrKey.key;
  const { projectile, setProjectileAtom } = useProjectileAtom(key);
  
  const {
    speed,
    direction, // in radians
  } = projectile;

  const move = () => {
    const xDelta = speed * Math.cos(direction);
    const yDelta = speed * Math.sin(direction);

    setProjectileAtom(p => ({
      ...p,
      x: p.x + xDelta,
      y: p.y + yDelta,
    }));
  };

  useTick(move);
};

/* Check every few ticks if the projectile is off-screen, and just delete it if it is */
const useDeleteSelfWhenOffscreen = (projectile: Projectile) => {
  // TODO: Note: is there a way to pull off the 'self' part of this suggestion without a provider?
  // const { projectile, resetProjectile, removeProjectile } = useProjectileAtom('self');

  const { key, x, y } = projectile;
  const { resetProjectile, removeProjectile } = useProjectileAtom(key);

  const isOffscreenThreshold = 200; // #px offscreen it should be before deleting. Generous and should be.
  const { width: screenWidth, height: screenHeight } = useRecoilValue(ScreenDimensionsSelector);

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

  const enemies = useRecoilValue(EnemyListSelector);

  /*
    Get a list of all of the enemies and check for collisions.

    TODO: Everything has up-to-date x, y, width, and height in the atoms, use that
  */

  const removeEnemy = useRecoilCallback(({ set }) => (enemyKey: string) => {
    set(EnemyIDListAtom, enemyIDList => enemyIDList.filter(id => id !== enemyKey));
  });


  const checkCollisions = () => {
    const { x, y, size } = projectile;

    const collisions = enemies.filter(enemy => {
      const { x: enemyX, y: enemyY, width, height } = enemy;

      return (
        x + size > enemyX &&
        x < enemyX + width &&
        y + size > enemyY &&
        y < enemyY + height
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
