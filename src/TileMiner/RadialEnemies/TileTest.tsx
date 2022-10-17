import { Box, Flex } from '@chakra-ui/react';
import { randomColor } from 'helpers';
import { FC } from 'react';
import Path, { Circle, Rect } from 'react-svg-path';
import { generateRing, ringInfo } from 'TileMiner/Enemies/atoms/RadialTiles';

import { DebugLabel } from './RadialDebug';

const DEBUG_CIRCLE_SIZE = 10;

export type ArcProps = Partial<{
  radius: number;
  rotation: number;
  arc: number;
  sweep: number;
  endX: number;
  endY: number;
  relative: boolean;
}>;

export const addArc = (p: any, props: ArcProps) => {
  const {
    radius = 0,
    rotation = 0,
    arc = 0,
    sweep = 0,
    endX = 0,
    endY = 0,
    relative = false,
  } = props;
  p.arc(radius, radius, rotation, arc, sweep, endX, endY, relative);
};


const width = 300;
const height = 100;

// PROBLEM: The two arcs are not the same length, and will NOT line up on either edge (nor should they)
// Any ring other than the center ring will have this problem, because the sides of the tile will be
//  slanted inward, since the inner and outer arc are different lengths

// Think of it this way:
// Take a circle and take concentric circle slices in it.
//  If you take the same number out of a given ring and the one above it (top and bottom arcs),
//   then they absolutely have to be different sizes. The Inside arc will be the same size as
//   the outside arc of the ring below it. Vice versa for the outside arc and the arc above it.


// Get the start and end points of the arc
export const getArcCoordsByRadius = (r: number, tileCount: number) => {
  const startAngleDeg = 0;
  const startAngle = startAngleDeg * (Math.PI / 180);
  // How many radians (arclength) is each tile?
  const tileArc = (Math.PI * 2) / tileCount;

  // We go counter-clockwise (negative) strictly because as complex `phase` increases,
  //  the angle increases counter-clockwise.
  const endAngle = startAngle - tileArc;

  const start = {
    x: r * Math.cos(startAngle),
    y: r * Math.sin(startAngle),
    angle: startAngle,
  };

  const end = {
    x: r * Math.cos(endAngle),
    y: r * Math.sin(endAngle),
    angle: endAngle,
  };

  return { start, end };
};

// TODO: PICKUP - Move this to a helper file, begin cleaning all of these up significantly
export const drawArc = (ring: number) => {
  const { radius: ringRadus, tileCount } = ringInfo(ring);
  const radius = ringRadus * height;

  // Draw an eigth of a circle arc
  const p = new Path();

  const { start, end } = getArcCoordsByRadius(radius, tileCount);


  p.fill('none');
  p.stroke(randomColor(190, ring));
  p.strokeWidth(5);
  p.moveTo(0, 0);
  // Line from the center to the top of the arc, then arc, then line to the center again
  // p.moveTo(x, y);

  // I have no idea why this works. And it scales perfectly with height changing afaik

  p.moveTo(start.x, start.y);

  addArc(p, {
    radius,
    sweep: 0,
    arc: 0,

    // This needs to be relative, so these need to be relative to the start point
    //  They're REALLY: just off of the center point, where we just came from
    endX: end.x,
    endY: end.y,
  });

  // Draw a line from the start to the outer arc's start, one height in start.angle
  const otherStart = {
    x: start.x + height * Math.cos(start.angle),
    y: start.y + height * Math.sin(start.angle),
  };

  const otherEnd = {
    x: end.x + height * Math.cos(end.angle),
    y: end.y + height * Math.sin(end.angle),
  };

  p.moveTo(start.x, start.y);
  p.lineTo(otherStart.x, otherStart.y);

  // Draw the outer arc
  addArc(p, {
    radius: radius + height,
    sweep: 0,
    arc: 0,
    endX: otherEnd.x,
    endY: otherEnd.y,
  });

  // Draw a line from the end of the outer arc to the end of the inner arc
  p.lineTo(end.x, end.y);


  return p;
};

const staticEnemies = Array.from({ length: 2 }).map((_, i) => generateRing(i)).slice(1);

const TileTest: FC<{ ring?: number }> = ({ ring = 1 }) => {
  const { radius: ringRadus, tileCount } = ringInfo(ring);
  const radius = ringRadus * height;


  const center = { x: width / 2, y: height / 2 };
  const { x, y } = center;


  // Wraps the arc to be transformed in easier to grasp ways
  // (Used to be where we moved the arc around to use 0,0 as the center in the drawing)
  const outerTransform = '';

  const debug = { ...center };

  return (
    <>

      <Box
        pos='absolute'
        top='50%'
        left='50%'
        transform='translate(-50%, -50%)'
        bg='#AA222255'
        overflow='visible'
      >

        <Box as='svg' width={ 50 } height={ 50 } overflow='visible'>

          <g transform='translate(25 25)' overflow='visible'>
            <DebugCircles ring={ ring } />
          </g>
        </Box>
      </Box>

      <OtherShit />

      <Box
        pos='absolute'
        display='none'
        top='4%'
        left='50%'
        transform='translate(-50%, 0%)'
        zIndex={ 1000 }
        bg='#EFFFEFDD'
        p={ 3 }
        fontSize={ 14 }
        rounded='md'
        minW={ 200 }
        minH={ 100 }
      >
        <DebugLabel label='Tile Count'>{ tileCount }</DebugLabel>
        <DebugLabel label='Radius'>{ radius }</DebugLabel>
        <Flex wrap='wrap'>
          {
          Object.entries(debug).map(([ key, value ]) => (
            <DebugLabel key={ key } label={ key }>{ value.toFixed(2) }</DebugLabel>
          ))
        }
        </Flex>
      </Box>
    </>
  );
};

export default TileTest;


const DebugCircles: FC<{ ring: number }> = ({ ring }) => {
  const { radius, tileCount } = ringInfo(ring);
  const { start, end } = getArcCoordsByRadius(radius * height, tileCount);

  // Draw a line from the start to the outer arc's start, one height in start.angle
  const otherStart = {
    x: start.x + height * Math.cos(start.angle),
    y: start.y + height * Math.sin(start.angle),
  };

  const otherEnd = {
    x: end.x + height * Math.cos(end.angle),
    y: end.y + height * Math.sin(end.angle),
  };

  return (
    <g>
      <Circle cx={ start.x } cy={ start.y } size={ DEBUG_CIRCLE_SIZE } fill='red' />
      <Circle cx={ end.x } cy={ end.y } size={ DEBUG_CIRCLE_SIZE } fill='blue' />
      <Circle cx={ 0 } cy={ 0 } size={ DEBUG_CIRCLE_SIZE } fill='darkOrange' />
      <Circle cx={ otherStart.x } cy={ otherStart.y } size={ DEBUG_CIRCLE_SIZE } fill='green' />
      <Circle cx={ otherEnd.x } cy={ otherEnd.y } size={ DEBUG_CIRCLE_SIZE } fill='purple' />
    </g>
  );
};

const Grid: FC<{ ring: number }> = ({ ring }) => {
  const grid = new Path();
  // Construct a grid that spans the height and width in 10px increments
  for (let i = 0; i < width; i += 10) {
    grid.moveTo(i, 0);
    grid.lineTo(i, height);
  }

  for (let i = 0; i < height; i += 10) {
    grid.moveTo(0, i);
    grid.lineTo(width, i);
  }


  return (
    <g>
      <Rect
        width={ width }
        height={ height }
        cx={ width / 2 }
        cy={ height / 2 }
        stroke='#0e98dd'
        strokeWidth={ 1 }
        fill='none'
      />
      {
            grid.toComponent({ stroke: 'black', strokeWidth: 1 })
        }
      {
    // Get it? It's the ORANGin of the svg
  }
      <Circle cx={ 0 } cy={ 0 } size={ DEBUG_CIRCLE_SIZE } fill='orange' />
    </g>
  );
};


const OtherShit: FC = () => (
  <Box
    pos='absolute'
    top='50%'
    left='50%'
    transform='translate(-50%, -50%)'
    zIndex={ 1000 }
  >
    X
  </Box>
);
