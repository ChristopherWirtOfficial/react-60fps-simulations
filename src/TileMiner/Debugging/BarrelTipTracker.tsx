import React, { FC } from 'react';

import { Box } from '@chakra-ui/react';
import useBoxStyles from 'hooks/Entities/useBoxStyles';
import { useAtomValue } from 'jotai';
import { GunTipPositionSelector } from 'TileMiner/Player/TilePlayerGun/useGun';

// I'll probably never fucking need this again lol but here it is
const BarrelTipTracker: FC = () => {
  const gunTipPos = useAtomValue(GunTipPositionSelector);

  const styles = useBoxStyles({
    key: 'gunTip',
    x: gunTipPos?.x ?? 0,
    y: gunTipPos?.y ?? 0,
    size: 10,
    color: 'white',
  });

  return (
    <Box { ...styles } bg='lime' fontWeight='bold' />
  );
};

export default BarrelTipTracker;
