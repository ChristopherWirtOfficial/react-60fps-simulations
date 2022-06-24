import { useAtom } from 'jotai';
import { useCallback } from 'react';
import { ScreenNodeAtom } from '../atoms/Screen/ScreenNodeAtom';

// Pretty handy I guess. I should probably use this same thing for the player, but they can't move and it seems to work? Idk actually lol
// TODO:Idk what the fuck to type this lol
const useAtomicRef = (atom: typeof ScreenNodeAtom) => {
  const [node, setNode] = useAtom(atom);
  const recoilRef = useCallback(value => setNode(value), [setNode]);


  return [recoilRef, node] as [<T2>() => T2, T];
};

export default useAtomicRef;
