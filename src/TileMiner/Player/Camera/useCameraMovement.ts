import { CAMERA_SPEED } from 'helpers/knobs';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import {
  A, D, KeyPressed, S, useCameraKeyboardCapture, W,
} from './useKeyboard';

export interface CameraPosition {
  x: number;
  y: number;
}

// Game positions, centered at 0,0 AKA relative to the center of the game
export const CameraPositionAtom = atom<CameraPosition>({ x: 0, y: 0 });

const useKeyMovement = (key: string, delta: CameraPosition) => {
  const keyPressed = useAtomValue(KeyPressed(key));
  const setCameraPosition = useSetAtom(CameraPositionAtom);

  useEffect(() => {
    if (keyPressed) {
      const interval = setInterval(() => {
        setCameraPosition(prevPosition => ({
          x: prevPosition.x + delta.x * CAMERA_SPEED,
          y: prevPosition.y + delta.y * CAMERA_SPEED,
        }));
      }, 1000 / 60); // This assumes a 60 FPS rate. Adjust as needed.

      return () => clearInterval(interval); // Cleanup when key is released or component unmounts.
    }

    // Because one codepath returns, they all must
    return () => {};
  }, [ keyPressed, setCameraPosition, delta ]);
};


const useCameraMovement = () => {
  useCameraKeyboardCapture();

  useKeyMovement(W, { x: 0, y: 1 });
  useKeyMovement(S, { x: 0, y: -1 });
  useKeyMovement(A, { x: -1, y: 0 });
  useKeyMovement(D, { x: 1, y: 0 });

  const { x, y } = useAtomValue(CameraPositionAtom);

  return { x, y };
};

export default useCameraMovement;
