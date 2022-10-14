import { Box } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';
import React, { FC } from 'react';
import PlayerSelector from '../PlayerSelector';

import TileMinerGunBarrel from './GunBarrel';


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
      // Rotation is negated because our angle (like most `phase` angles) is measured counter-clockwise
      transform={ `translate(-50%, -50%) rotate(${-firingDirection}rad)` }
      // TODO: THis makes us spin smoothly, but the guntip doesn't track as well as I'd like, and
      ///   there's a problem with it going over the 0/360 boundary (which is on the wrong side because of counter-clockwise lol)
      // transition='all 10s'
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
