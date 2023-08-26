import { Box, Flex } from '@chakra-ui/react';
import useBoxStyles from 'hooks/Entities/useBoxStyles';
import React, { FC } from 'react';

import { useAtomValue } from 'jotai';
import { BenchedDudes } from 'TileMiner/Enemies/Dudes/TileEnemyDudesAtoms';
import TileMinerGun from './TilePlayerGun/GunBase';
import { useTileMiner } from './useTileMinerPlayer';


const TileMinerPlayer: FC = () => {
  const player = useTileMiner();

  const styles = useBoxStyles(player);

  const benchedDudesCount = useAtomValue(BenchedDudes);

  const benchedDudes = Array.from({ length: benchedDudesCount }).map((_, i) => i);

  return (
    <Box bg={ player.color } { ...styles } border='1px yellow solid'>
      <Flex p={ 1.5 } gap={ 1.5 }>
        {
          benchedDudes.map(dudeId => (
            <Box
              key={ dudeId }
              bg='lightgray'
              w='10px'
              h='10px'
            />
          ))

        }
      </Flex>
      { /* <TileMinerGun /> */ }
    </Box>
  );
};


export default TileMinerPlayer;
