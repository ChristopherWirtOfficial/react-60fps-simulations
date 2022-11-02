import { Box } from '@chakra-ui/react';
import { FC } from 'react';
import { RadialTile, ringInfo } from 'TileMiner/Enemies/atoms/radialTiles';

import { DebugLabel } from './RadialDebug';
import Tile from './RadialTile';

// Represents a portion of a disc that is a ring of tiles in the radial enemy system
// Like a paving stone
const RadialEnemy: FC<{ tile: RadialTile }> = ({ tile }) => {
  const { ring, index, height, width } = tile;
  const { radius, tileCount } = ringInfo(ring);

  return (
    <>
      <Box as='svg' overflow='visible'>
        <Tile tile={ tile } />
      </Box>
      <Box
        p={ 3 }
        bg='lightGreen'
        rounded='md'
        pos='absolute'
        fontSize={ 12 }
        zIndex={ 101 }
      >
        { /* <DebugLabel label='Ring'>{ ring }</DebugLabel> */ }
        { /* <DebugLabel label='Index'>{ index }</DebugLabel> */ }
      </Box>
    </>
  );
};

export default RadialEnemy;
