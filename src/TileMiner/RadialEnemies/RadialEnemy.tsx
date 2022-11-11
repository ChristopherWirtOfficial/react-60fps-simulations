import { Box } from '@chakra-ui/react';
import { FC } from 'react';
import { RadialTile, ringInfo } from 'TileMiner/Enemies/atoms/radialTiles';

import Tile from './RadialTile';

// Represents a portion of a disc that is a ring of tiles in the radial enemy system
// Like a paving stone
const RadialEnemy: FC<{ tile: RadialTile }> = ({ tile }) => {
  const { ring, index, height, width } = tile;
  const { radius, tileCount } = ringInfo(ring);

  return (
    <Box as='svg' overflow='visible'>
      <Tile tile={ tile } />
    </Box>
  );
};

export default RadialEnemy;
