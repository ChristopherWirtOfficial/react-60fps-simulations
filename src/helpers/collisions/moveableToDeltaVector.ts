import { collapseMovementSteps } from 'hooks/Entities/useMovement';
import { Moveable } from 'types/Boxes';

/**
 * @name moveableToDeltaVectors
 *
 * @param moveablePosA The first position of the Moveable to generate a delta vector for
 * @param moveablePosB The second position of the Moveable to generate a delta vector for
 *
 * @returns The DeltaVector between these two positions
 */
export const moveablePositionsToDeltaVectors = (moveablePosA: Moveable, moveablePosB: Moveable) => {
  const deltaX = moveablePosB.x - moveablePosA.x;
  const deltaY = moveablePosB.y - moveablePosA.y;

  const direction = Math.atan2(deltaY, deltaX);
  const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

  return {
    x: moveablePosA.x,
    y: moveablePosA.y,
    direction,
    length,

    // Kind of arbitrary, but if they're different sizes between steps I guess we should take the average lmao
    boxSize: (moveablePosA.size + moveablePosB.size) / 2,
  };
};

/**
 * @name moveableToDeltaVector
 * @description Projects a Moveable one tick worth of its MovementSteps into the future and generate the DeltaVector.
 *
 * @param moveable The Moveable to project/simulate
 */
const moveableToDeltaVector = (moveable: Moveable) => {
  const projectedMoveable = collapseMovementSteps(moveable);
  return moveablePositionsToDeltaVectors(moveable, projectedMoveable);
};

export default moveableToDeltaVector;
