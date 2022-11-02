import { Box } from '@chakra-ui/react';
import { FC, useMemo } from 'react';
import { generateRing } from 'TileMiner/Enemies/atoms/radialTiles';

import RadialDebug from './RadialDebug';
import RadialEnemy from './RadialEnemy';

const N_RINGS = 5;

// Plus 1 to make and toss out the center ring
const staticEnemies = Array.from({ length: N_RINGS }).map((_, i) => i + 1);


const TileRing: FC<{ ring: number }> = ({ ring }) => {
  const tiles = useMemo(() => generateRing(ring), [ ring ]);

  return (
    <Box
      pos='absolute'
      top='50%'
      left='50%'
      transform='translate(-50%, -50%)'
      overflow='visible'
    >
      <svg
        overflow='visible'
        // TODO: Still not happy about these 1px values here
        width='1px'
        height='1px'
      >
        {
        tiles.map(tile => <RadialEnemy key={ `${tile.ring}-${tile.index}` } tile={ tile } />)
      }
      </svg>
    </Box>
  );
};

const RadialEnemies: FC = () => (
  <>
    <RadialDebug />
    {
      staticEnemies.map(ring => <TileRing key={ ring } ring={ ring } />)
    }
  </>
);

export default RadialEnemies;


