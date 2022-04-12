import { RecoilState, useRecoilCallback, useRecoilValue } from 'recoil';

// Pretty handy I guess. I should probably use this same thing for the player, but they can't move and it seems to work? Idk actually lol
const useRecoilRef = <T>(atom: RecoilState<T>) => {
  const node = useRecoilValue(atom);
  const recoilRef = useRecoilCallback(({ set }) => (value: T) => {
    // BUG: This doesn't actually make it reactive... it just works better than the other one.
    // But it can't be resized so ..
    // TODO: I guess
    set(atom, value);
  }, [ atom ]);

  return [ recoilRef, node ] as [ <T2>() => T2, T ];
};

export default useRecoilRef;
