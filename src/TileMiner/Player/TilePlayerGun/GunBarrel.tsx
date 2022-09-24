import React, { FC, useRef } from 'react';

import { Box } from '@chakra-ui/react';
import TileMinerBarrelTip from './BarrelTip';
import { useTileMiner } from '../useTileMinerPlayer';

const TileMinerGunBarrel: FC = () => {
  const player = useTileMiner();

  return (
    <Box
      pos='relative'
      w='0.75em'
      h='0.1em'
      bg='black'
      transform='translateY(-50%)'
      left='50%'
      top='50%'
      zIndex={ 1 }
    >
      <TileMinerBarrelTip />
    </Box>
  );
};

export default TileMinerGunBarrel;
