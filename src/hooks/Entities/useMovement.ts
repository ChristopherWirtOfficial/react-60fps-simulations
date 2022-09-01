import { atomFamily, atomWithDefault, useAtomCallback } from 'jotai/utils';
import {
  atom, Getter, SetStateAction, useAtom, useAtomValue, useSetAtom, WritableAtom,
} from 'jotai';
import { useEffect } from 'react';
import useTick from '../useTick';
import { Box } from './useBoxStyles';
import { ORBIT_EAGERNESS, ORBIT_RADIUS } from '../../knobs';
import executeMovementVector from './movement-steps/executeMovementVector';

/*
  Moveable boxes operate with vectors that are acted upon by specified Movement Step functions.

  Movement Steps are functions that take a Moveable box and return a new Moveable box.
  They are mutators that can act on the box's x, y, direction, and speed.
*/
export interface Moveable extends Box {
  // The actual movement vector to execute on every movement tick
  speed: number;
  direction: number;

  orbitRadius?: number;

  movementSteps: MovementStep<Moveable>[];

  // lenny-face emoji - One day... ;)
  // rotationSpeed: number;
  // rotation: number;
}

type WriteGetter = Getter; // Parameters<WritableAtom<SetStateAction<T | null>, void>['write']>[0];

export type MovementStep<T extends Moveable> = (box: T, get?: WriteGetter) => T;


// BUG: This has a memory leak! Nothing ever removes things from this atom family
// TODO: Either use a more robust Entity manager (I really would rather not tbh...)
//  or store the movementSteps on the atom itself and make a Jotai selector that returns the movementSteps for an entity

// We're not storing them externally, but we're giving the responsability of storing them to the useMovement hook.
// They're still totally thrown away with the base entity's lifecylce. I think this should be the core of my approach,
//  to effectively avoid building any sort of robust entity manager. We'll see if damage can work in a similar way.
export const MovementStepsAtomFamily = atomFamily(() => atom([] as MovementStep<Moveable>[]));

export const useTargetMovementSteps = (key: string): MovementStep<Moveable>[] => {
  const steps = useAtomValue(MovementStepsAtomFamily(key));
  return steps;
};

// TODO: Should this be changed to accept an Atom instead of a box and box update callback?
const useMovement = <T extends Moveable>(
  moveableAtom: WritableAtom<T, SetStateAction<T>, void>,
) => {
  const [box, setBox] = useAtom(moveableAtom);


  const { movementSteps } = box;

  // Hoist the `get` out of useAtomCallback for the movement steps to access atomic state
  // NOTE: Currently unused, but sounds useful?
  const getAtomicState = useAtomCallback((_get, _, arg) => _get(arg as any));

  useTick(() => {
    // Pass the box through each movement step, always ending with the stepMovementVector step which executes our vector
    const allMovementSteps = [...movementSteps, executeMovementVector];
    if (!box?.speed) {
      // Nothing else to do I guess, there's no speed and probably no box at all..
      console.error('No box data', { box });
      throw new Error('No box data in useMovement\'s tick');
    }

    // BUG: There's some weird typescript shit happening here. I think I have a typing issue with the MovementStep funtor type
    // @ts-ignore
    const newBox: T = allMovementSteps.reduce((boxState: Moveable, step) => {
      if (!boxState) {
        throw new Error('No box state in useMovement\'s tick');
      }

      const stepRes = step(boxState, getAtomicState);
      if (!stepRes) {
        throw new Error('No step result in useMovement\'s tick');
      }

      // It's a little hack-y, but it's at least exactly how this is intended to be used
      return stepRes;
    }, box);

    // @ts-ignore
    if (box.targetKey) {
      console.log('projectile', box, newBox);
    }
    // Update the box with the new data
    setBox(newBox);
  });
};

export default useMovement;
