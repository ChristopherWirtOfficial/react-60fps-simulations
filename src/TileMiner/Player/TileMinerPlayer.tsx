import { Box, Center, Flex } from '@chakra-ui/react';
import useBoxStyles from 'hooks/Entities/useBoxStyles';
import { FC } from 'react';

import { useAtomValue } from 'jotai';
import { BenchedDudes } from 'TileMiner/Enemies/Dudes/TileEnemyDudesAtoms';
import RelativeTileGrid from 'TileMiner/Tiles/RelativeTileGrid';
import { DUDE_SIZE } from 'TileMiner/Enemies/Dudes/TileEnemyDudes';
import { useMaterialEssence } from 'TileMiner/Tiles/GameTiles/StoreTile';
import { useTileMiner } from './useTileMinerPlayer';

// TODO: Decouple the old player stuff buried in tthe atoms of useTileMiner
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
      <CenteredReadout />
    </Box>
  );
};


export default TileMinerPlayer;

// TODO: Move this stuff to probably a bunch of places. Distribute the information amongst the UI!
const CenteredReadout: FC = () => {
  const { materialEssence } = useMaterialEssence();

  return (
    <Box
      pos='absolute'
      top='50%'
      left='50%'
      transform='translate(-50%, -50%)'
      fontSize='20'
      color='white'
    >
      { /* Put stuff in here to show on the enemy */ }
      { materialEssence }
    </Box>
  );
};
