import { Box } from '@chakra-ui/react';
import useScreen from 'atoms/Screen/useScreen';
import { FC, useMemo } from 'react';
import { generateRing, RadialTile, ringInfo } from 'TileMiner/Enemies/atoms/radialTiles';

import RadialDebug from './RadialDebug';
import RadialEnemy from './RadialEnemy';

const N_RINGS = 5;

// Plus 1 to make and toss out the center ring
const staticEnemies = Array.from({ length: N_RINGS }).map((_, i) => i + 1);

// Individual RadialTile debug, renders at the center of the tile
// TODO: Formalize the part that goes from tile -> x,y center I guess
const RadialTileDebug: FC<{ tile: RadialTile }> = ({ tile }) => {
  const {
    ring, index, radius, height, angleWidth,
  } = tile;
  const { tileCount } = ringInfo(ring);

  const tileCenterRadius = radius + (height / 2);
  const tileCenterAngle = (index / tileCount) * 2 * Math.PI + (angleWidth / 2);

  const tileCenterX = tileCenterRadius * Math.cos(tileCenterAngle);
  const tileCenterY = -tileCenterRadius * Math.sin(tileCenterAngle);

  const screenInfo = useScreen();

  const tileCenterScreenX = screenInfo.width / 2 + tileCenterX - screenInfo.center.x;
  const tileCenterScreenY = screenInfo.height / 2 + tileCenterY - screenInfo.center.y;

  return (
    <Box
      key={ `${ring}-${index}` }
      pos='absolute'
      transform='translate(-50%, -50%)'
      top={ tileCenterScreenY }
      left={ tileCenterScreenX }
      bg='#33333333'
      color='white'
      fontSize='lg'
      px={ 5 }
    >
      <Box color='pink'>
        { ring }
      </Box>
      <Box>
        { index }
      </Box>
    </Box>
  );
};


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
      {
        tiles.map(tile => <RadialTileDebug key={ `debug-${tile.ring}-${tile.index}` } tile={ tile } />)
      }
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


