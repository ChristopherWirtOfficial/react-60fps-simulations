import { Box } from '@chakra-ui/react';
import { FC, useMemo } from 'react';
import {
  generateRing, RADIAL_TILE_SIZE, ringInfo, TILE_HEIGHT, TILE_WIDTH,
} from 'TileMiner/Enemies/atoms/RadialTiles';

import RadialEnemy from './RadialEnemy';

const N_RINGS = 5;

// Plus 1 to make and toss out the center ring
const staticEnemies = Array.from({ length: N_RINGS }).map((_, i) => i);


const TileRing: FC<{ ring: number }> = ({ ring }) => {
  const tiles = useMemo(() => generateRing(ring), [ ring ]);
  const { radius: ringRadus, tileCount } = ringInfo(ring);

  return (
    <Box
      pos='absolute'
      top='50%'
      left='50%'
      transform='translate(-50%, -50%)'
      overflow='visible'
      width={ `${RADIAL_TILE_SIZE}px` }
      height={ `${RADIAL_TILE_SIZE}px` }
    >
      <svg
        overflow='visible'
        // This must be equal to half the px size of the parent, the RADIAL_TILE_SIZE is for debugging specifically
        transform={ `translate(${RADIAL_TILE_SIZE / 2} ${RADIAL_TILE_SIZE / 2})` }
        width='1px'
      // TODO: Why does this height need to be 1px? It throws eveything off otherwise
      //  Of the 4 values here, it seems like ONLY THE HEIGHT affects the radial positions of the tiles
        height='1px'
      >
        {
      tiles.map(tile => <RadialEnemy key={ `${tile.ring}-${tile.index}` } tile={ tile } />)
    }
      </svg>
    </Box>
  );
};

console.log(TILE_HEIGHT, TILE_WIDTH);

const RadialEnemies: FC = () => (
  <>
    {
      staticEnemies.map(ring => <TileRing key={ ring } ring={ ring } />)
    }
  </>
);

export default RadialEnemies;


