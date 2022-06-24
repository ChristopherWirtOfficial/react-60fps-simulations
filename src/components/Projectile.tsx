import React, { FC } from 'react';

import useProjectile from '../atoms/Projectiles/useProjectile';
import useBoxStyles from '../hooks/Entities/useBoxStyles';


const ProjectileComp: FC<{ projectileKey: string }> = ({ projectileKey }) => {
  const projectile = useProjectile(projectileKey);

  const styles = useBoxStyles(projectile);

  return (
    <div
      className="projec"
      style={ {
        ...styles,
        background: projectile?.target?.color ?? 'black',
      } }
    />
  );
};

export default ProjectileComp;
