import { Box, HStack } from '@chakra-ui/react';
import { ScreenDimensionsSelector } from 'atoms/Screen/ScreenNodeAtom';
import { randomColor } from 'helpers';
import { useAtomValue } from 'jotai';
import { FC, useMemo } from 'react';
import Path, { Rect } from 'react-svg-path';
import { RadialTile, ringInfo } from 'TileMiner/Enemies/atoms/RadialTiles';

import { DebugLabel } from './RadialDebug';

const ACTUAL_SIZE_SCALE = 250;

// Represents a portion of a disc that is a ring of tiles in the radial enemy system
// Like a paving stone
const RadialEnemy: FC<{ tile: RadialTile }> = ({ tile }) => {
  const { ring, index, height, width } = tile;
  const { radius, tileCount } = ringInfo(ring);

  // TODO: Unswap height and width inside ringInfo lol
  const realWidth = height * ACTUAL_SIZE_SCALE;
  const realHeight = width * ACTUAL_SIZE_SCALE;
  const realRadius = radius * ACTUAL_SIZE_SCALE;

  const angle = (index / tileCount) * 2 * Math.PI;
  const x = radius * Math.cos(angle) * ACTUAL_SIZE_SCALE;
  const y = radius * Math.sin(angle) * ACTUAL_SIZE_SCALE;

  const { center } = useAtomValue(ScreenDimensionsSelector);

  // Convert from our cartesian coordinates to CSS coordinates for transform
  const cssX = x + center.x;
  const cssY = center.y - y;

  // Offset the X and Y by half the size of the box
  // NOTE: Everything, including their height and width, is now exclusively in the realm of "cartesian" CSS coordinates
  const trueX = cssX - realWidth / 2;
  const trueY = cssY - realHeight / 2;

  // Get the radius of the circle at the far side of the tile
  const farRadius = realRadius + realHeight / 2;
  const closeRadius = realRadius - realHeight / 2;

  // Get the percentage of the ring that this tile takes up
  const tilePercent = 1 / tileCount;

  // Using the two radiuses to get the circumferences, find the length of the top and bottom arc
  const topArcLength = 2 * Math.PI * farRadius * tilePercent;
  const bottomArcLength = 2 * Math.PI * closeRadius * tilePercent;

  const color = useMemo(() => randomColor(150), []);

  const tileStartAngle = angle - tilePercent * 180;
  const tileEndAngle = angle + tilePercent * 180;

  // TODO: PICKUP - I don't know how to work with SVGs and get a paving tile (two arcs and two lines) to actually work
  // arc(rx,ry,rotation,arc,sweep,ex,ey,relative = false)
  const p = new Path();
  p.moveTo(realWidth / 2, realHeight / 2);
  p.arc(2 * farRadius, 2 * farRadius, 0, 1, 1, -farRadius, -farRadius);
  p.stroke('black');
  p.strokeWidth(5);
  p.fill('none');
  const PathComponent = p.toComponent({ transform: 'rotate(0)' });


  // A rx ry x-axis-rotation large-arc-flag sweep-flag x y
  //  a rx ry x-axis-rotation large-arc-flag sweep-flag dx dy
  return (
    <>
      <Box
        pos='absolute'
        as='svg'
        top={ trueY }
        left={ trueX }
        transform={ `rotate(${-angle}rad)` }
        overflow='visible'
        width={ realWidth }
        height={ realHeight }
        bg='red'
      >
      </Box>
      <Box
        p={ 3 }
        bg='lightGreen'
        rounded='md'
        pos='absolute'
        top={ cssY }
        left={ cssX }
        // transform={ `rotate(${angle}rad)` }
        fontSize={ 12 }
        zIndex={ 101 }
      >
        <HStack>
          <DebugLabel label='Far'>{ farRadius.toFixed(1) }</DebugLabel>
          <DebugLabel label='Close'>{ closeRadius.toFixed(1) }</DebugLabel>
        </HStack>
        <HStack>
          <DebugLabel label='Start'>{ tileStartAngle.toFixed(2) }</DebugLabel>
          <DebugLabel label='End'>{ tileEndAngle.toFixed(2) }</DebugLabel>
        </HStack>
      </Box>
    </>
  );
};

export default RadialEnemy;
