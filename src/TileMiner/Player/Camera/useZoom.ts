import { DEFAULT_ZOOM } from 'helpers/knobs';
import useTick, { useAtomicTick } from 'hooks/useTick';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';

// Clamp the actual camera zoom level between the min and max zoom value levels
const MAX_ZOOM_VALUE = 10;
const MIN_ZOOM_VALUE = -10;

// Only let the tick functor change the zoom level by this much per tick (to prevent zooming too fast)
const MAX_ZOOM_STEP = 1;
const ZOOM_SCROLL_SCALING_FACTOR = 0.000000000000001;

// The actual Camera Zoom Level exposed to the camera
export const CameraZoomAtom = atom(DEFAULT_ZOOM);


type ScrollEvent = number;
export const CameraZoomEventsAtom = atom<ScrollEvent[]>([]);


const ZoomAtom = atom(null, (get, set, zoom: number) => {
  // Throw the delta into the queue
  set(CameraZoomEventsAtom, events => [ ...events, zoom ]);
});

// Used to tick the zoom level based on the queue of zoom events
const ZoomTick = atom(null, (get, set) => {
  // Get the zoom events from the queue
  const zoomEvents = get(CameraZoomEventsAtom);
  if (zoomEvents.length === 0) {
    return;
  }
  set(CameraZoomEventsAtom, []);

  const zoomDelta = zoomEvents.reduce((acc, zoom) => acc + zoom, 0);
  const finalZoom = Math.sign(zoomDelta) * Math.max(MAX_ZOOM_STEP, Math.abs(zoomDelta));

  // Clamp the zoom level between the min and max zoom value levels
  const currentZoom = get(CameraZoomAtom);
  const projectedZoom = currentZoom + finalZoom;
  const zoom = Math.min(MAX_ZOOM_VALUE, Math.max(MIN_ZOOM_VALUE, projectedZoom));

  set(CameraZoomAtom, zoom);
});


export const useCaptureScroll = () => {
  const Zoom = useSetAtom(ZoomAtom);

  useEffect(() => {
    const wheelEventHandler = (e: WheelEvent) => {
      const zoom = e.deltaY * ZOOM_SCROLL_SCALING_FACTOR;
      Zoom(zoom); // https://www.youtube.com/watch?v=_yF3fCWfmEk
    };

    window.addEventListener('wheel', wheelEventHandler);

    return () => {
      window.removeEventListener('wheel', wheelEventHandler);
    };
  }, [ Zoom ]);
};

// SMORT: (weirdly specific stackoverflow lol) https://stackoverflow.com/questions/5527601/normalizing-mousewheel-speed-across-browsers
// TODO: ZOOM FACTORS
/*
  Keep shit from -10 to 10
  The actual scaling factor caused by zooming is then something like 1.1^zoom
    (or 1/(1 - (10 - zoom)) or something)
*/

const useZoom = () => {
  useCaptureScroll();
  const [ zoom ] = useAtom(CameraZoomAtom);

  useAtomicTick(ZoomTick, 30);

  return zoom;
};

export default useZoom;
