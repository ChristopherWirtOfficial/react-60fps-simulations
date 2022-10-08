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

export const useCameraKeyboardCapture = () => {
  const w = useMemo(() => 'w', []);
  const a = useMemo(() => 'a', []);
  const s = useMemo(() => 's', []);
  const d = useMemo(() => 'd', []);
  useKey(w);
  useKey(a);
  useKey(s);
  useKey(d);
};
