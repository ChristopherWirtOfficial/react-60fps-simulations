import { atom, useAtomValue } from 'jotai';
import { CameraPosition, CameraPositionAtom } from './useCameraMovement';
import { CameraZoomAtom } from './useZoom';

export interface Camera extends CameraPosition {
  zoom: number;
}

// Camera Atom
export const CameraAtom = atom<Camera>(get => {
  const { x, y } = get(CameraPositionAtom);
  const zoom = get(CameraZoomAtom);

  return {
    x,
    y,
    zoom,
  };
});

const useCamera = () => {
  const camera = useAtomValue(CameraAtom);

  return camera;
};

export default useCamera;

