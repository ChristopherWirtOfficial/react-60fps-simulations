import { randomColor } from 'helpers';
import Path from 'react-svg-path';
import { RadialTile } from 'TileMiner/Enemies/atoms/radialTiles';

export type ArcProps = Partial<{
  radius: number;
  rotation: number;
  arc: number;
  sweep: number;
  endX: number;
  endY: number;
  relative: boolean;
}>;

const addArc = (p: any, props: ArcProps) => {
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


const drawTile = (tile: RadialTile) => {
  const {
    radius, width, height, ring,
  } = tile;

  const end = {
    x: radius,
    y: 0,
    angle: 360,
  };

  // An individual tile's arclength is apparently equal to the .. width / radius?
  // I probably derived this, but now I don't know from what lol
  const arcLength = width / radius;
  const endAngle = -arcLength;

  // NOTE: We find the actual exact drawing coordinates for each tile
  // Everything is drawn in the same exact slice, and then rotated by the other component to its position
  // Not sure how to feel about that though
  const start = {
    x: radius * Math.cos(endAngle),
    y: radius * Math.sin(endAngle),
    angle: endAngle,
  };

  const p = new Path();

  p.fill('none');
  p.stroke(randomColor(190, ring));
  p.strokeWidth(3);

  p.moveTo(start.x, start.y);

  addArc(p, {
    radius,
    sweep: 1,
    arc: 0,

    endX: end.x,
    endY: end.y,
    relative: false,
  });

  // Draw a line from the start to the outer arc's start, one height in start.angle
  const otherStart = {
    x: radius + height,
    y: 0,
  };

  // Just further out along the perpindicular line from the start of the original arc
  p.lineTo(otherStart.x, otherStart.y);

  const otherEnd = {
    x: start.x + height * Math.cos(start.angle),
    y: start.y + height * Math.sin(start.angle),
  };

  // Draw the outer arc from the other start, on the x-axis at y=0 again, to the other end
  addArc(p, {
    radius: radius + height,
    sweep: 0,
    arc: 0,
    endX: otherEnd.x,
    endY: otherEnd.y,
  });


  // Draw a line from the end of the outer arc to the end of the inner arc
  p.moveTo(otherEnd.x, otherEnd.y);
  p.lineTo(start.x, start.y);


  return p;
};

export default drawTile;
