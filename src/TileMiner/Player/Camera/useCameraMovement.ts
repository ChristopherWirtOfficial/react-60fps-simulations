import { CAMERA_SPEED } from 'helpers/knobs';
import useTick from 'hooks/useTick';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import {
  A, D, KeyPressed, S, useCameraKeyboardCapture, W,
} from './useKeyboard';

export interface CameraPosition {
  x: number;
  y: number;
}

// Game positions, centered at 0,0 AKA relative to the center of the game
export const CameraPositionAtom = atom<CameraPosition>({ x: 0, y: 0 });

const TickCameraMovement = atom(null, (get, set) => {
  const { x, y } = get(CameraPositionAtom);
  const w = get(KeyPressed(W));
  const a = get(KeyPressed(A));
  const s = get(KeyPressed(S));
  const d = get(KeyPressed(D));

  const newX = x + (d ? CAMERA_SPEED : 0) - (a ? CAMERA_SPEED : 0);

  // NOTE: These are BACKWARDS because the Y axis is inverted for all of the same reasons as always I think
  // But it's double backewards because we also push away in the wrong way, so that one ISN'T negative, and that makes it backwards
  const newY = y - (s ? CAMERA_SPEED : 0) + (w ? CAMERA_SPEED : 0);

  set(CameraPositionAtom, { x: newX, y: newY });
});


const useCameraMovement = () => {
  useCameraKeyboardCapture();
  const tick = useSetAtom(TickCameraMovement);

  useTick(tick);

  const { x, y } = useAtomValue(CameraPositionAtom);

  return { x, y };
};

export default useCameraMovement;
