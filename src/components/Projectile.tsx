import { Box } from '@chakra-ui/react';
import { collapseMovementSteps } from 'hooks/Entities/useMovement';
import React, { FC } from 'react';

import useProjectile from '../atoms/Projectiles/useProjectile';
import useBoxStyles from '../hooks/Entities/useBoxStyles';


const ProjectileComp: FC<{ projectileKey: string }> = ({ projectileKey }) => {
  const projectile = useProjectile(projectileKey);
  const { target } = projectile;

  const nextPosition = collapseMovementSteps(projectile);
  const otherStyles = useBoxStyles(nextPosition);

  const styles = useBoxStyles(projectile);

  // TODO: Make this (and every other box in the useBoxStyles family) a Chakra component that speaks Box
  return (
    <>
      <div
        style={ {
          ...styles,
          opacity: target ? 1 : 1,
          background: target?.color ?? 'black',
        } }
      />
      { /* <div
        style={ {
          ...otherStyles,
          opacity: target ? 1 : 1,
          background: 'red',
        } }
      /> */ }
    </>
  );
};

export default ProjectileComp;
