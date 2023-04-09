import { Box } from '@chakra-ui/react';
import { FC } from 'react';
import useMinerProjectile from 'TileMiner/Projectiles/useMinerProjectile';

import useBoxStyles from '../hooks/Entities/useBoxStyles';


const ProjectileComp: FC<{ projectileKey: string }> = ({ projectileKey }) => {
  // const projectile = useProjectile(projectileKey); // OOPS I guess I don't actually know what I'm doing sometimes
  const projectile = useMinerProjectile(projectileKey);


  // const nextPosition = collapseMovementSteps(projectile);
  // const otherStyles = useBoxStyles(nextPosition);

  const styles = useBoxStyles(projectile);
  // TODO: Do all the collision math, if any, with a circle in mind
  return (
    <Box
      { ...styles }
      bg='red'
      rounded='full'
    >
      { /* <Box pos='absolute'>{ projectile.x } { projectile.y }</Box> */ }
    </Box>
  );
};

export default ProjectileComp;
