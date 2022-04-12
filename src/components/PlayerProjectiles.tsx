import React, { FC, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import useProjectileKeys from '../atoms/Projectiles/useProjectiles';
import useTick from '@/hooks/useTick';
import ProjectileComp from './Projectile';
import ClosestEnemySelector from '../atoms/Enemies/ClosestEnemySelector';
import { TICKS_BETWEEN_ATTACKS } from '../knobs';
import { getTickFunctors } from '../hooks/useTick';

const PROCECTILE_COUNT = 1;

const PlayerProjectiles: FC = () => {
  const { projectileKeys, addProjectile } = useProjectileKeys();

  useEffect(() => {
    // Temporarily fire only X projectiles
    for (let i = 0; i < PROCECTILE_COUNT; i++) {
      addProjectile();
    }
  }, []);

  const closestEnemy = useRecoilValue(ClosestEnemySelector);

  // TODO: Find a good permenant spot for this, obviously it'll be tied to the player and their attack speed.
  // Attacks!
  useTick(() => {
    // Small note, but useTick or useTick(..., 40) neither one will inherently cause re-renders.
    // This one does, because it does modify reactive state that causes re-renders of the projectileKeys, but a useTick doesn't force a re-render.

    if (closestEnemy) {
      addProjectile();
    }
  }, TICKS_BETWEEN_ATTACKS);


  return (
    <div className="player-projectiles">
      <div>Registered Functors: { getTickFunctors().length } </div>
      <div>Projectiles: { projectileKeys.length } </div>
      {
        projectileKeys.map(key => <ProjectileComp key={ key } projectileKey={ key } />)
      }
    </div>
  );
};

export default PlayerProjectiles;

