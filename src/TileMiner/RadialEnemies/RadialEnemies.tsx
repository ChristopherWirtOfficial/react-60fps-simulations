import { Box } from '@chakra-ui/react';
import { FC } from 'react';
import { generateRing, RadialTile } from 'TileMiner/Enemies/atoms/RadialTiles';

import RadialEnemy from './RadialEnemy';

const N_RINGS = 10;

const staticEnemies = Array.from({ length: N_RINGS }).map((_, i) => generateRing(i)).slice(1);


const TileRing: FC<{ ring: RadialTile[] }> = ({ ring }) => (
  <Box
    pos='absolute'
    top='50%'
    left='50%'
    transform='translate(-50%, -50%)'
    bg='#AA222255'
    overflow='visible'
    // TODO: This width/height can be ANYTHING really, but the transform in the svg would need to be adjusted
    // Mostly I'm just playing around to try and figure out what parts of this are important for later
    width='100px'
    height='100px'
  >
    <svg
      overflow='visible'
      transform='translate(50 50)'
      width='1px'
      // TODO: Why does this height need to be 1px? It throws eveything off otherwise
      //  Of the 4 values here, it seems like ONLY THE HEIGHT affects the radial positions of the tiles
      height='1px'
    >
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
  </>
);

export default RadialEnemies;


