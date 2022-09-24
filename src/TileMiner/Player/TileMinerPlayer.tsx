import React, { FC } from 'react';

import { Box } from '@chakra-ui/react';
import useBoxStyles from 'hooks/Entities/useBoxStyles';
import TileMinerDebug from './TilePlayerDebug';
import TileMinerGun from './TilePlayerGun/GunBase';
import { useTileMiner } from './useTileMinerPlayer';


const TileMinerPlayerBox: FC = () => {
  const player = useTileMiner();

  const styles = useBoxStyles(player);
  return (
    <>
      <Box bg={ player.color } { ...styles } border='1px yellow solid'>
        <TileMinerGun />
      </Box>
      <TileMinerDebug />
    </>
  );
};


export default TileMinerPlayerBox;
