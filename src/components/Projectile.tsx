import React, { FC } from 'react';
import useProjectile from '../atoms/Projectiles/useProjectile';

const ProjectileComp: FC<{ projectileKey: string }> = ({ projectileKey }) => {
  const projectile = useProjectile(projectileKey);
  const {
    x,
    y,
    size,
    direction, // in radians
  } = projectile;


  // TODO: Refactor this to use a hook that encapsulates the logic for drawing anything to the screen, including Projecticles and the BasicBox, maybe the player.
  return (
    <div
      className="projec"
      style={ {
        position: 'absolute',
        transform: `translate(${x}px, ${y - size}px) rotate(${direction}deg)`,
        zIndex: 500,
        background: 'black',
        width: `${size}px`,
        height: `${size}px`,
      } }
    />
  );
};

export default ProjectileComp;
