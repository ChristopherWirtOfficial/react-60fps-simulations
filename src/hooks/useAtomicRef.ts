import { Setter, useAtom, WritableAtom } from 'jotai';
import { MutableRefObject, useCallback, useRef } from 'react';
import { ScreenNodeAtom } from '../atoms/Screen/ScreenNodeAtom';

// Pretty handy I guess. I should probably use this same thing for the player, but they can't move and it seems to work? Idk actually lol
// TODO:Idk what the fuck to type this lol
// const useAtomi1cRef = <T extends HTMLElement, T2 extends WritableAtom<T, unknown, void>>(atom: T2) => {
//   const [node, setNode] = useAtom(atom);
//   const recoilRef = useCallback((value: T) => setNode(value), [setNode]);

//   const ref = useRef<HTMLDivElement>();

//   return [recoilRef, node];
// };

// type NotAPromise<T> = T extends Promise<infer U> ? U : T;

type AtomicRefAtom<T> = WritableAtom<T, T, void>;

// OLD-PU: I need to create a type that's literally anything, but definitely not a Promise
// I think I can do this with a union type, but I'm not sure how to do that


type UseAtomicRef = <T extends HTMLDivElement> (atom: AtomicRefAtom<T>) => [MutableRefObject<T>, T];

const useAtomicRef: UseAtomicRef = <T extends HTMLDivElement>(atom: AtomicRefAtom<T>) => {
  const atomicState = useAtom<T, T, void>(atom);
  const node = atomicState[0] as T;
  const setNode = atomicState[1];

  // This is basically all the ref is under the hood, a callback that gets called when the ref is set or updated
  // AS FAR AS I KNOW this isn't a hack, it's the only real way to make a custom React ref
  const recoilRef = useCallback((value: T) => setNode(value), [setNode]) as unknown as MutableRefObject<T>;

  return [recoilRef, node];
};

export default useAtomicRef;
