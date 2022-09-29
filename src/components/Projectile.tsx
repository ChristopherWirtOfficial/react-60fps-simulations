import { Box } from '@chakra-ui/react';
import { collapseMovementSteps } from 'hooks/Entities/useMovement';
import React, { FC } from 'react';

import useProjectile from '../atoms/Projectiles/useProjectile';
import useBoxStyles from '../hooks/Entities/useBoxStyles';


const ProjectileComp: FC<{ projectileKey: string }> = ({ projectileKey }) => {
  const projectile = useProjectile(projectileKey);

  // console.log(projectile);
  const { target } = projectile;

  const nextPosition = collapseMovementSteps(projectile);
  const otherStyles = useBoxStyles(nextPosition);

  const styles = useBoxStyles(projectile);

  return (
    <>

      <Box
        { ...styles }
        bg='red'
        // zIndex={ 100 }
      >
        { /* <Box pos='absolute'>{ projectile.x } { projectile.y }</Box> */ }
      </Box>
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
