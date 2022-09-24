import { Box } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';
import React, { FC } from 'react';
import TileMinerGunBarrel from './GunBarrel';
import { PlayerSelector } from '../PlayerAtoms';


// Positioned inside of the TileMinerPlayerBox component as a barrel that spins
const TileMinerGun: FC = () => {
  const player = useAtomValue(PlayerSelector);

  const { firingDirection } = player;

  const size = (Math.sqrt(2) / 2) - 0.03;
  const sizeInEm = `${size}em`;

  return (
    // The base of the gun, the barrel rotates around this
    <Box
      pos='absolute'
      top='50%'
      left='50%'
        // transform and rotate the barrel
      transform={ `translate(-50%, -50%) rotate(${firingDirection}rad)` }
      transition='rotate 0.1s'
      rotate=''
      w={ sizeInEm }
      h={ sizeInEm }
      bg='darkgray'
      fontSize={ `${player.size}px` }
    >
      <TileMinerGunBarrel />
    </Box>
  );
};

export default TileMinerGun;
