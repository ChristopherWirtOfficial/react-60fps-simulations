import { Box } from '@chakra-ui/react';
import { FC } from 'react';
import { generateRing, RadialTile } from 'TileMiner/Enemies/atoms/RadialTiles';

import RadialEnemy from './RadialEnemy';


const staticEnemies = Array.from({ length: 3 }).map((_, i) => generateRing(i)).slice(1);


const TileRing: FC<{ ring: RadialTile[] }> = ({ ring }) => (
  <Box
    pos='absolute'
    top='50%'
    left='50%'
    transform='translate(-50%, -50%)'
    bg='#AA222255'
    overflow='visible'
    // TODO: Setting these to 1px "fixes" drawing issues, but it probably shouldn't be my answer
    // (same with the svg width/height)
    width='1px'
    height='1px'
  >
    <svg overflow='visible' width='1px' height='1px'>
      {
      ring.map(tile => <RadialEnemy key={ `${tile.ring}-${tile.index}` } tile={ tile } />)
    }
    </svg>
  </Box>
);

const RadialEnemies: FC = () => (
  <>
    {
    staticEnemies.map((ring, i) => <TileRing key={ i } ring={ ring } />)
    }
    { /* <TileRing ring={ staticEnemies[0] } /> */ }
  </>
);

export default RadialEnemies;


