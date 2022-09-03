import React, { FC } from 'react';

import useProjectile from '../atoms/Projectiles/useProjectile';
import useBoxStyles from '../hooks/Entities/useBoxStyles';


const ProjectileComp: FC<{ projectileKey: string }> = ({ projectileKey }) => {
  const projectile = useProjectile(projectileKey);
  const { target } = projectile;

  const styles = useBoxStyles(projectile);

  return (
    <div
      style={ {
        ...styles,
        opacity: target ? 1 : 0,
        background: target?.color ?? 'black',
      } }
    />
  );
};

export default ProjectileComp;
