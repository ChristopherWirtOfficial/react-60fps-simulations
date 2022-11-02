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
    radius, width, height,
  } = tile;

  const start = {
    x: radius,
    y: 0,
    angle: 0,
  };


  const arcLength = width / radius;
  const endAngle = arcLength;

  const end = {
    x: radius * Math.cos(endAngle),
    y: radius * Math.sin(endAngle),
    angle: endAngle,
  };

  const p = new Path();

  p.fill('none');
  p.stroke(randomColor(190));
  // Real one disabled for now while debugging
  // p.stroke(randomColor(190, ring));
  p.strokeWidth(3);
  // TODO: I should probably bake the stroke width (aka a real border that we need to account for in the math)
  p.moveTo(0, 0);
  // Line from the center to the top of the arc, then arc, then line to the center again
  // p.moveTo(x, y);


  p.moveTo(start.x, start.y);

  addArc(p, {
    radius,
    sweep: 1,
    arc: 0,

    // This needs to be relative, so these need to be relative to the start point
    //  They're REALLY: just off of the center point, where we just came from
    endX: end.x,
    endY: end.y,
    relative: false,
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
    sweep: 1,
    arc: 0,
    endX: otherEnd.x,
    endY: otherEnd.y,
  });

  // Draw a line from the end of the outer arc to the end of the inner arc
  p.lineTo(end.x, end.y);


  return p;
};

export default drawTile;
