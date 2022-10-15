import { atom, useSetAtom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { useEffect, useMemo } from 'react';


export const KeyPressed = atomFamily((key: string) => atom(false));

const KeyPressActivators = atomFamily((key: string) => atom(null, (get, set, activate: boolean) => {
  const currentVal = get(KeyPressed(key));
  if (currentVal !== activate) {
    set(KeyPressed(key), activate);
  }
}));

export const useKeyPressActivator = (key: string) => {
  const change = useSetAtom(KeyPressActivators(key));

  return {
    activate: () => change(true),
    deactivate: () => change(false),
  };
};

// TODO: Refactor this hook into an atom family (maybe new, maybe the current idc)
/*
  atomWithDefault - I think we can use this on the atom family (or something like it) to
   register the event listeners the first time anyone tries to get the pressed state of any given key.

  On one side - just register absolutely every key that we receive an event for, independent from gettings its state.
  On the other side - Consumers can still know if a key is pressed in the exact same way, without ever registering the key
*/
export const useKey = (key: string) => {
  const { activate, deactivate } = useKeyPressActivator(key);

  useEffect(() => {
    const downHandler = ({ key: pressedKey }: KeyboardEvent) => {
      if (pressedKey === key) {
        activate();
      }
    };

    const upHandler = ({ key: pressedKey }: KeyboardEvent) => {
      if (pressedKey === key) {
        deactivate();
      }
    };

    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [ activate, deactivate, key ]);
};

// Declared as consts to give them total referential stability so that they can be used as dependencies
export const W = 'w';
export const A = 'a';
export const S = 's';
export const D = 'd';

// TODO: Replace this with useKeyboard which registers event listeners and captures all keydown and keyup events by key
// Think this through again, but we SHOULD be okay on performance because ONLY consumers of a key will cause updates/re-renders ANYWHERE
export const useCameraKeyboardCapture = () => {
  // TODO: Do these need to be memoized? Are they actually stable with the current implementation?
  const w = useMemo(() => 'w', []);
  const a = useMemo(() => 'a', []);
  const s = useMemo(() => 's', []);
  const d = useMemo(() => 'd', []);

  useKey(w);
  useKey(a);
  useKey(s);
  useKey(d);
};
