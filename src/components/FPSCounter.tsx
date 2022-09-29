import { SHOW_FPS } from 'helpers/knobs';
import useTick from 'hooks/useTick';
import { FC, useRef, useState } from 'react';

let currentFps = 0;
// Use requestAnimationFrame to truly compute the framerate
const trackFps = (last: number) => {
  if (!SHOW_FPS) {
    return;
  }

  requestAnimationFrame(() => {
    const now = Date.now();
    const delta = now - last;

    currentFps = 1000 / delta;

    trackFps(now);
  });
};

const startTime = performance.now();
requestAnimationFrame(() => trackFps(startTime));


const FPSCounter: FC = () => {
  const [ last60TickTimes, setLast60TickTimes ] = useState<number[]>([]);
  const lastFrameTimeRef = useRef<number>(performance.now());

  useTick(() => {
    // Rolling average FPS based on timerRef.current
    const now = performance.now();
    const lastFrameTime = lastFrameTimeRef.current;
    const delta = now - lastFrameTime;
    lastFrameTimeRef.current = now;
    setLast60TickTimes(prevVal => [ ...prevVal, delta ].slice(-60));
  });

  const averageTickLength = last60TickTimes.reduce((acc, curr) => acc + curr, 0) / last60TickTimes.length;
  const fps = 1000 / averageTickLength;

  return (
    <div>
      <span>FPS: { fps.toFixed(0) } ({ currentFps.toFixed(0) })</span>
    </div>
  );
};

export default FPSCounter;
