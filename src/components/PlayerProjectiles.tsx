import React, { FC } from 'react';
import useProjectileKeys from '../atoms/Projectiles/useProjectiles';
import useTick from '@/hooks/useTick';
import ProjectileComp from './Projectile';


const PlayerProjectiles: FC = () => {
  const { projectileKeys, addProjectile } = useProjectileKeys();

  // TODO: Find a good permenant spot for this, obviously it'll be tied to the player and their attack speed.
  // Attacks!
  useTick(() => {
    // Small note, but useTick or useTick(..., 40) neither one will inherently cause re-renders.
    // This one does, because it does modify reactive state that causes re-renders of the projectileKeys, but a useTick doesn't force a re-render.
    console.log('Adding a projectile');
    addProjectile();
  }, 40);


  return (
    <div className="player-projectiles">
      {
        projectileKeys.map(key => <ProjectileComp key={ key } projectileKey={ key } />)
      }
    </div>
  );
};

export default PlayerProjectiles;

