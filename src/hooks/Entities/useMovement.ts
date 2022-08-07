import { atomFamily, atomWithDefault, useAtomCallback } from 'jotai/utils';
import { atom, Getter, useAtomValue, useSetAtom } from 'jotai';
import useTick from '../useTick';
import { Box } from './useBoxStyles';
import { ORBIT_EAGERNESS, ORBIT_RADIUS } from '../../knobs';
import { useEffect } from 'react';

/*
  Moveable boxes operate with vectors that are acted upon by specified Movement Step functions.

  Movement Steps are functions that take a Moveable box and return a new Moveable box.
  They are mutators that can act on the box's x, y, direction, and speed.
*/
export interface Moveable extends Box {
  speed: number;
  direction: number;
  orbitRadius?: number;
  // rotation: number;
}

type WriteGetter = Getter; // Parameters<WritableAtom<SetStateAction<T | null>, void>['write']>[0];

export type MovementStep<T extends Moveable> = (box: T, get?: WriteGetter) => T;

// Yes I'm a genius, but I don't like to show off
// When the box is close to its orbit point (default 20px from the center), change the direction to insert into an orbit around the center
export const enterOrbit = (<T extends Moveable>(box: T) => {
  const { x, y, direction, speed } = box;

  const orbitRadius = box?.orbitRadius ?? ORBIT_RADIUS;

  // Lol the orbit center could be an entity's current position lmaoo
  const orbitCenter = {
    x: 0,
    y: 0,
  };


  // Start moving to intercept the orbit radius at 2x the orbit radius
  if (orbitRadius > 0) {
    const angleTowardCenter = Math.atan2(y - orbitCenter.y, x - orbitCenter.x);

    const interceptX = Math.cos(angleTowardCenter) * (orbitRadius);
    const interceptY = Math.sin(angleTowardCenter) * (orbitRadius);
    const distanceToIntercept = Math.sqrt(
      (x - interceptX) ** 2 + (y - interceptY) ** 2,
    );

    const distanceToCenter = Math.sqrt((x - orbitCenter.x) ** 2 + (y - orbitCenter.y) ** 2);

    const orbitalCircumference = 2 * Math.PI * orbitRadius;
    const first = (distanceToCenter / (3 * orbitRadius));
    const second = (speed / orbitalCircumference);

    const offset = (first + second) * (ORBIT_EAGERNESS / 20);
    // The angle one tick further along the orbit circumference at our speed
    const offsetAngle = angleTowardCenter + offset;

    const insertionPointX = Math.cos(offsetAngle) * orbitRadius;
    const insertionPointY = Math.sin(offsetAngle) * orbitRadius;

    const distanceToInsertionPoint = Math.sqrt(
      (insertionPointX - x) ** 2 + (insertionPointY - y) ** 2,
    );

    // If we're close to the insertion point, then we need to change direction
    const insertionAngle = Math.atan2(insertionPointY - y, insertionPointX - x);

    const directionDifferenceRaw = (insertionAngle - direction);
    const diffSign = Math.sign(directionDifferenceRaw);

    // try to dampen the direction difference when it goes across the y axis and becomes nearly
    //  2PI radians away in the negative or positive direction
    const directionDifference = Math.abs(directionDifferenceRaw) > Math.PI ?
      directionDifferenceRaw - diffSign * 2 * Math.PI :
      directionDifferenceRaw;

    const top = (distanceToInsertionPoint - distanceToIntercept);
    const bottom = (1 + distanceToInsertionPoint);

    const ratio = top / bottom;

    // lol the 0.2 is a magic number to make up for the fact that we're angling directly toward the insertion point
    // It's basically our anti-gravity to stay closer to the oribtal plane until I get smarter
    const newDirection = ratio * directionDifference + direction - 0.2;


    return {
      ...box,
      direction: newDirection % (2 * Math.PI),
      insertionPointX,
      insertionPointY,
      interceptX,
      interceptY,
      offsetAngle,
      insertionAngle,
    };
  }

  return box;
});


// Step the box in the direction it is moving at the speed it is moving
export const stepMovementVector: MovementStep<Moveable> = box => {
  const { x, y, direction, speed } = box;

  const newX = x + Math.cos(direction) * speed;
  const newY = y + Math.sin(direction) * speed;

  return {
    ...box,
    x: newX,
    y: newY,
  };
};

// TODO: This has a memory leak! Nothing ever removes things from this atom family
export const MovementStepsAtomFamily = atomFamily(() => atom([] as MovementStep<Moveable>[]));

export const useTargetMovementSteps = (key: string): MovementStep<Moveable>[] => {
  const steps = useAtomValue(MovementStepsAtomFamily(key));
  return steps;
};


const useMovement = <T extends Moveable>(
  box: T,
  boxUpdateCallback: (box: T) => void,
  movementSteps: MovementStep<T>[] = [],
) => {
  if (!boxUpdateCallback) {
    throw new Error('useMovement requires a boxUpdateCallback');
  }

  const setEnemyMovementSteps = useSetAtom(MovementStepsAtomFamily(box.key));

  useEffect(() => {
    // TODO: There's clearly a better way here, but I don't see it.
    setEnemyMovementSteps(movementSteps as any as MovementStep<Moveable>[]);
  }, [setEnemyMovementSteps, movementSteps]);


  // Hoist the `get` out of useAtomCallback for the movement steps to access atomic state
  // TODO: This is probably better managed with a larger scale entity system
  const getAtomicState = useAtomCallback((_get, _, arg) => _get(arg as any));

  useTick(() => {
    // Pass the box through each movement step, always ending with the stepMovementVector step which executes our vector
    const allMovementSteps = [...movementSteps, stepMovementVector];
    if (!box?.speed) {
      // Nothing else to do I guess, there's no speed and probably no box at all..
      console.error('No box data', { box });
      throw new Error('No box data in useMovement\'s tick');
    }

    const newBox = allMovementSteps.reduce((boxState, step): T => {
      if (!boxState) {
        throw new Error('No box state in useMovement\'s tick');
      }

      const stepRes = step(boxState, getAtomicState);
      if (!stepRes) {
        throw new Error('No step result in useMovement\'s tick');
      }

      // It's a little hack-y, but it's at least exactly how this is intended to be used
      return stepRes as T;
    }, box);


    // Update the box with the new data
    boxUpdateCallback(newBox);
  });
};

export default useMovement;
