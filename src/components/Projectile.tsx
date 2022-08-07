import { useAtomValue } from 'jotai';
import React, { FC } from 'react';
import EnemyAtomFamily from '../atoms/Enemies/EnemyAtomFamily';

import useProjectile from '../atoms/Projectiles/useProjectile';
import useBoxStyles from '../hooks/Entities/useBoxStyles';


const ProjectileComp: FC<{ projectileKey: string }> = ({ projectileKey }) => {
  const projectile = useProjectile(projectileKey);

  const styles = useBoxStyles(projectile);

  const target = useAtomValue(EnemyAtomFamily(projectile.targetKey ?? ''));

  return (
    <div
      className="projec"
      style={ {
        ...styles,
        opacity: target ? 1 : 0,
        background: target?.color ?? 'black',
      } }
    />
  );
};

export default ProjectileComp;
