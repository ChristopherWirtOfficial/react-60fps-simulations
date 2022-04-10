import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { ScreenDimensionsSelector } from '@atoms/Screen/ScreenNodeAtom';
import useTick from '@hooks/useTick';
import { Projectile, ProjectileAtomFamily } from './ProjectileAtomFamily';
import useProjectiles from './useProjectiles';

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
  const { screenWidth, screenHeight } = useRecoilValue(ScreenDimensionsSelector);

  const checkOffscreen = () => {
    if (
      x < -isOffscreenThreshold || x > screenWidth + isOffscreenThreshold ||
      y < -isOffscreenThreshold || y > screenHeight + isOffscreenThreshold
    ) {
      console.log('Projectile off screen, deleting', projectile);
      resetProjectile();
      removeProjectile(key);
    }
  };

  useTick(checkOffscreen, 5);
};


const useProjectile = (projectileOrKey: Projectile | string) => {
  const key = typeof projectileOrKey === 'string' ? projectileOrKey : projectileOrKey.key;

  const { projectile } = useProjectileAtom(key);

  /* Hooks to perform the really re-usable aspects of the projectile. */
  useMove(projectile);
  useDeleteSelfWhenOffscreen(projectile);

  return projectile;
};


export default useProjectile;
