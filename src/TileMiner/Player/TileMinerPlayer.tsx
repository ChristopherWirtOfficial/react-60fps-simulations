import { Box, Flex } from '@chakra-ui/react';
import useBoxStyles from 'hooks/Entities/useBoxStyles';
import { FC } from 'react';

import { useAtomValue } from 'jotai';
import { BenchedDudes } from 'TileMiner/Enemies/Dudes/TileEnemyDudesAtoms';
import RelativeTileGrid from 'TileMiner/Tiles/RelativeTileGrid';
import { DUDE_SIZE } from 'TileMiner/Enemies/Dudes/TileEnemyDudes';
import { useTileMiner } from './useTileMinerPlayer';


const TileMinerPlayer: FC = () => {
  const player = useTileMiner();

  const styles = useBoxStyles(player);

  const benchedDudesCount = useAtomValue(BenchedDudes);

  const benchedDudes = Array.from({ length: benchedDudesCount }).map((_, i) => i);

  return (
    <Box bg={ player.color } { ...styles } border='1px yellow solid'>
      <RelativeTileGrid>
      </RelativeTileGrid>
      <Flex p={ 1.5 } gap={ 1.5 }>
        {
          benchedDudes.map(dudeId => (
            <Box
              key={ dudeId }
              bg='lightgray'
              w={ DUDE_SIZE }
              h={ DUDE_SIZE }
            />
          ))

        }
      </Flex>
      { /* <TileMinerGun /> */ }
    </Box>
  );
};


export default TileMinerPlayer;
