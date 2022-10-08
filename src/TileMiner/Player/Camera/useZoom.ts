import { DEFAULT_ZOOM, ZOOM_MAX, ZOOM_MIN, ZOOM_SCROLL_SCALING_FACTOR } from 'helpers/knobs';
import { atom, useAtom, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { useKey } from './useKeyboard';

export const CameraZoomAtom = atom(DEFAULT_ZOOM);

const ZoomAtom = atom(null, (get, set, zoom: number) => {
  const currentZoom = get(CameraZoomAtom);
  set(CameraZoomAtom, currentZoom + zoom);
});

const useKeyboardZoom = () => {
  // useKey()
};

export const useCaptureScroll = () => {
  const Zoom = useSetAtom(ZoomAtom);

  useEffect(() => {
    const scrollHandler = (e: WheelEvent) => {
      console.log('scroll', e.deltaY, e);
      // Scale the zoom by the scroll delta
      const scaledZoom = e.deltaY * ZOOM_SCROLL_SCALING_FACTOR;
      const zoom = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, scaledZoom));
      Zoom(zoom); // https://www.youtube.com/watch?v=_yF3fCWfmEk
      e.preventDefault();
    };

    window.addEventListener('wheel', scrollHandler);

    return () => {
      // window.removeEventListener('wheel', scrollHandler);
    };
  }, [ Zoom ]);
};

const useZoom = () => {
  const [ zoom ] = useAtom(CameraZoomAtom);

  return zoom;
};

export default useZoom;
