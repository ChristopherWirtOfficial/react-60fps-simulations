import React, { useState, useEffect, FC, useCallback } from 'react';

import useTick from '../hooks/useTick';
import { now } from '../helpers';
import useTimedAverage from '../hooks/useTimedAverage';


const Test2: FC = () => {
  const [ startingTime ] = useState(now());
  const [ currentFrameTime, setCurrentFrameTime ] = useState(now());
  const [ prevFrameTime, setPrevFrameTime ] = useState(now());
  const [ frameTime, setFrameTime ] = useState(0);
  const [ tickCount, setTickCount ] = useState(0);

  // Timed average for frame time
  const { add: addFrameTime, average: averageFrameTime } = useTimedAverage(1000);

  // Timed average for framerate
  const { add: addFramerate, average: averageFramerate } = useTimedAverage(1000);

  useTick(() => {
  // console.log('re-render');
    const currentTime = now();
    const difference = currentTime - currentFrameTime;

    setTickCount(tickCount + 1);

    addFrameTime(difference, currentTime);
    addFramerate(1000 / difference, currentTime);

    setFrameTime(oldFrameTime => oldFrameTime + difference);
    setPrevFrameTime(currentFrameTime);
    setCurrentFrameTime(currentTime);
  });


  return (
    <div>
      <div>
        Real Elapsed: { (now() - startingTime).toFixed(2) }
        <br />
        Last Frame Duration: { (currentFrameTime - prevFrameTime).toFixed(2) }
        <br />
        Average Tick Duration: { averageFrameTime.toFixed(2) }
        <br />
        Frames Per Second: { averageFramerate.toFixed(2) }
      </div>
    </div>
  );
};

export default Test2;
