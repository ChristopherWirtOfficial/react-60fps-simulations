import React, { FC } from 'react';
import useTick from '@hooks/useTick';
import { Projectile } from '@atoms/Projectiles/ProjectileAtomFamily';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { ProjectileAtomFamily, useProjectileKeyList } from '../atoms/Projectiles/ProjectileAtomFamily';
import { ScreenDimensionsSelector } from '../atoms/Screen/ScreenNodeAtom';

const ProjectileComp: FC<{ projectile: Projectile }> = ({ projectile }) => {
  const {
    key,
    x,
    y,
    size,
    speed,
    direction, // in radians
  } = projectile;

  // TODO: Encapsulate a lot of this into a hook that exposes simple atomic methods like "Delete Projectile", operating in the scope
  // of the given Projectile, but hiding the recoil details.
  const [ , setProjectileAtom ] = useRecoilState(ProjectileAtomFamily(key));
  const resetProjectile = useResetRecoilState(ProjectileAtomFamily(key));
  const { removeProjectile } = useProjectileKeyList();

  const { width: screenWidth, height: screenHeight } = useRecoilValue(ScreenDimensionsSelector);

  // Every tick, move the projectile by the speed in the direction
  useTick(() => {
    const xDelta = speed * Math.cos(direction);
    const yDelta = speed * Math.sin(direction);

    setProjectileAtom(p => {
      const newX = p.x + xDelta;
      const newY = p.y + yDelta;

      const threshold = 100; // Pretty generous, no real reason not to be :)

      // If our new position is just straight up off the screen by more than the threshold, delete the projectile
      if (newX < -threshold || newX > screenWidth + threshold || newY < -threshold || newY > screenHeight + threshold) {
        console.log('Projectile off screen, deleting', p);
        resetProjectile();
        removeProjectile(key);
      }

      return {
        ...p,
        x: p.x + xDelta,
        y: p.y + yDelta,
      };
    });
  });

};

export default ProjectileComp;
