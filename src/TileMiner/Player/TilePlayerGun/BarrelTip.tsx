import { Box } from '@chakra-ui/react';
import React, { FC } from 'react';

import { useTileMiner } from '../useTileMinerPlayer';
import useGun from './useGun';
import useShootProjectiles from './useShootProjectiles';

const TIP_VISIBLE = false;

// We go this deep to get the POSITION of the tip of the gun barrel, so we can spawn bullets from there.
const TileMinerBarrelTip: FC = () => {
  const player = useTileMiner();
  const { ref, gunTipPosition } = useGun(player);

  // useShootProjectiles(player, gunTipPosition);


  // Define the "tip" of the barrel
  return (
    <Box
      fontSize='10px'
      pos='absolute'
      right='1em'
      top='50%'
      transform='translateY(-50%)'
      color='white'
      fontWeight='bold'
      w='1em'
      h='1em'
      bg='red'
      zIndex={ 2 }
      opacity={ TIP_VISIBLE ? 1 : 0 }
    >
      <Box
        // Attach the ref to a 1x1 pixel box in the exact center of the "tip"
        ref={ ref }
        pos='absolute'
        top='50%'
        left='50%'
        transform='translate(-50%, -50%)'
        bg='blue'
        w='1px'
        h='1px'
        zIndex={ 3 }
      />
    </Box>
  );
};

export default TileMinerBarrelTip;
