import { ScreenDimensionsSelector } from 'atoms/Screen/ScreenNodeAtom';
import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';

export type Target = { x: number, y: number };

export type ArrowPosition = { x: number, y: number, angle: number }; // x, y, and rotation angle

const INDICATOR_PADDING_RATIO = 0.9;

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

  const arrowPos: ArrowPosition = {
    x: arrowX,
    y: arrowY,
    angle: (Math.atan2(-normalizedDir.y, normalizedDir.x) * 180 / Math.PI + 360) % 360, // Convert radian to degree and ensure it's positive
  };

  return arrowPos;
}));

export default ArrowPositionAtomFamily;
