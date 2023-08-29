import { ScreenDimensionsSelector } from 'atoms/Screen/ScreenNodeAtom';
import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';

export type Target = { x: number, y: number };

export type ArrowPosition = {
  x: number,
  y: number,
  angle: number,
  shown: boolean,
};

const INDICATOR_PADDING_RATIO = 0.9;
const INDICATOR_MIN_DISTANCE_RATIO = 0.1;

const ArrowPositionAtomFamily = atomFamily((target: Target) => atom<ArrowPosition>(get => {
  const { viewport } = get(ScreenDimensionsSelector);

  // Direction vector from the center of the viewport to the target.
  const dir = {
    x: target.x - viewport.x,
    y: target.y - viewport.y,
  };

  // Calculate magnitude (length) of the direction vector
  const magnitude = Math.sqrt(dir.x ** 2 + dir.y ** 2);

  // Normalize the direction vector
  const normalizedDir = {
    x: dir.x / magnitude,
    y: dir.y / magnitude,
  };

  // Arrow's position on the edge of the viewport (unclamped)
  let arrowX = dir.x;
  let arrowY = dir.y;

  const viewportWidthTolerance = (viewport.width * INDICATOR_PADDING_RATIO) / 2;
  const viewportHeightTolerance = (viewport.height * INDICATOR_PADDING_RATIO) / 2;

  // Clamp the arrow's position to the viewport dimensions
  arrowX = Math.max(-viewportWidthTolerance, Math.min(arrowX, viewportWidthTolerance));
  arrowY = -Math.max(-viewportHeightTolerance, Math.min(arrowY, viewportHeightTolerance));


  // We effectively create an ellipse with the viewport's dimensions, and check if the "arrow" (the target, really) is within the ellipse
  // If it is, we hide it
  // The goal is to hide the arrow if the target is more than like 25% "on" the screen
  // In terms of algorithm, in my head it's like:
  //   - We figure out the formula for an ellipse that sits at 12.5% of the viewport's minor axis away from the edges of the screen
  //      (this means that even the major axis is based on a value relative to the minor, and is the same for both)
  //   - If the target is within the ellipse, we hide the arrow

  const minorAxisLength = Math.min(viewport.width, viewport.height);
  const offset = minorAxisLength * INDICATOR_MIN_DISTANCE_RATIO / 2;

  // Width and height of the "inner" ellipse
  const ellipseWidth = viewport.width - offset * 2;
  const ellipseHeight = viewport.height - offset * 2;

  // Calculate the major and minor radii of the ellipse
  const a = viewport.width > viewport.height ? ellipseWidth / 2 : ellipseHeight / 2;
  const b = viewport.width > viewport.height ? ellipseHeight / 2 : ellipseWidth / 2;

  // Check if the target point is inside the ellipse
  const insideEllipse = (arrowX ** 2) / (a ** 2) + (arrowY ** 2) / (b ** 2) <= 1;

  const rectangleMargin = minorAxisLength * INDICATOR_MIN_DISTANCE_RATIO;

  const absDeviationX = Math.abs(arrowX);
  const absDeviationY = Math.abs(arrowY);

  const outsideHorizontalBounds = absDeviationX > viewport.width / 2 - rectangleMargin;
  const outsideVerticalBounds = absDeviationY > viewport.height / 2 - rectangleMargin;

  const shown = !(insideEllipse) || outsideHorizontalBounds || outsideVerticalBounds;

  const arrowPos: ArrowPosition = {
    x: arrowX,
    y: arrowY,
    angle: (Math.atan2(-normalizedDir.y, normalizedDir.x) * 180 / Math.PI + 360) % 360,
    shown,
  };

  return arrowPos;
}));

export default ArrowPositionAtomFamily;
