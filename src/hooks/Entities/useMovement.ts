import useTick from '../useTick';
import { Box } from './useBoxStyles';
import { ORBIT_EAGERNESS, ORBIT_RADIUS } from '../../knobs';

/*
  Moveable boxes operate with vectors that are acted upon by specified Movement Step functions.

  Movement Steps are functions that take a Moveable box and return a new Moveable box.
  They are mutators that can act on the box's x, y, direction, and speed.
*/
export interface Moveable extends Box {
  speed: number;
  direction: number;
  // rotation: number;
}

type MovementStep = <T extends Moveable>(box: T) => T;

// Step the box in the direction it is moving at the speed it is moving
const stepMovementVector = <T extends Moveable>(box: T) => {
  const { x, y, direction, speed } = box;

  const newX = x + Math.cos(direction) * speed;
  const newY = y + Math.sin(direction) * speed;

  return {
    ...box,
    x: newX,
    y: newY,
  };
};

// Yes I'm a genius, but I don't like to show off
// When the box is close to its orbit point (default 20px from the center), change the direction to insert into an orbit around the center
export const enterOrbit = <T extends Moveable>(box: T) => {
  const { x, y, direction, speed } = box;

  const orbitRadius = ORBIT_RADIUS;
  const orbitCenter = {
    x: 0,
    y: 0,
  };

  const distanceFromCenter = Math.sqrt(
    (x - orbitCenter.x) ** 2 + (y - orbitCenter.y) ** 2,
  );

  // Start moving to intercept the orbit radius at 2x the orbit radius
  if (orbitRadius > 0) {
    const angleTowardCenter = Math.atan2(y - orbitCenter.y, x - orbitCenter.x);

    const interceptX = Math.cos(angleTowardCenter) * (orbitRadius);
    const interceptY = Math.sin(angleTowardCenter) * (orbitRadius);
    const distanceToIntercept = Math.sqrt(
      (x - interceptX) ** 2 + (y - interceptY) ** 2,
    );

    const orbitalCircumference = 2 * Math.PI * orbitRadius;
    const offset = (speed / orbitalCircumference) * ORBIT_EAGERNESS;

    // The angle one tick further along the orbit circumference at our speed
    const offsetAngle = angleTowardCenter + offset;

    const insertionPointX = Math.cos(offsetAngle) * ORBIT_RADIUS;
    const insertionPointY = Math.sin(offsetAngle) * ORBIT_RADIUS;

    const distanceToInsertionPoint = Math.sqrt(
      (insertionPointX - x) ** 2 + (insertionPointY - y) ** 2,
    );

    // If we're close to the insertion point, then we need to change direction
    const insertionAngle = Math.atan2(insertionPointY - y, insertionPointX - x);

    const directionDifference = (insertionAngle - direction) % (2 * Math.PI);


    const newDirection = ((distanceToInsertionPoint - distanceToIntercept) / (1 + distanceToInsertionPoint) * directionDifference) + direction;


    if (newDirection < direction) {
      console.log('new direction', {
        direction, newDirection, distanceToInsertionPoint, distanceToIntercept, directionDifference, insertionAngle, offsetAngle, insertionPointX, insertionPointY, x, y, interceptX, interceptY, orbitCenter, orbitRadius, angleTowardCenter, offset, orbitalCircumference,
      });
    }

    return {
      ...box,
      direction: newDirection,
      insertionPointX,
      insertionPointY,
      interceptX,
      interceptY,
      offsetAngle,
      // tangentAngle,
      insertionAngle,
    };
  }

  return box;
};


const useMovement = <T extends Moveable>(box: T, movementSteps: MovementStep[], boxUpdateCallback: (Box: T) => void) => {
  if (!boxUpdateCallback) {
    throw new Error('useMovement requires a boxUpdateCallback');
  }

  useTick(() => {
    // Pass the box through each movement step, always ending with the stepMovementVector step which executes our vector
    const allMovementSteps = [ ...movementSteps, stepMovementVector ];
    const newBox = allMovementSteps.reduce((boxData, step) => step(boxData), box);

    // Update the box with the new data
    boxUpdateCallback(newBox);
  });
};

export default useMovement;
