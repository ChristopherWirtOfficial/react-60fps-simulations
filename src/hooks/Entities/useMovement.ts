import { atomFamily, useAtomCallback } from 'jotai/utils';
import {
  atom, SetStateAction, useAtom, useAtomValue, WritableAtom,
} from 'jotai';
import { Moveable, MovementStep } from 'types/Boxes';
import useTick from '../useTick';
import executeMovementVector from './movement-steps/executeMovementVector';

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
  const [ box, setBox ] = useAtom(moveableAtom);


  const { movementSteps } = box;

  // Hoist the `get` out of useAtomCallback for the movement steps to access atomic state
  // NOTE: Currently unused, but sounds useful? Maybe for getting positions of other entities (that don't move)
  // const getAtomicState = useAtomCallback((_get, _, arg) => _get(arg as any));

  useTick(() => {
    // Pass the box through each movement step, always ending with the stepMovementVector step which executes our vector
    const allMovementSteps = [ ...movementSteps, executeMovementVector ];
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

      const stepRes = step(boxState);
      if (!stepRes) {
        throw new Error('No step result in useMovement\'s tick');
      }

      // It's a little hack-y, but it's at least exactly how this is intended to be used
      return stepRes;
    }, box);

    // Update the box with the new data
    setBox({
      ...newBox,
      prevX: box.x,
      prevY: box.y,
    });
  });
};

export default useMovement;
