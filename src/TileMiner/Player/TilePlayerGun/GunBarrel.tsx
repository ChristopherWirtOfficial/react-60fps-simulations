import { Box } from '@chakra-ui/react';
import React, { FC } from 'react';

import TileMinerBarrelTip from './BarrelTip';

const TileMinerGunBarrel: FC = () => (
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

export default TileMinerGunBarrel;
