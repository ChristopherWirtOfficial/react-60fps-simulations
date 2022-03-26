import React, { useState, useEffect, FC } from 'react';

const now = () => Date.now();

const Test1: FC = () => {
  const [ startingTime, setStartingTime ] = useState(now());
  const [ prevFrameTime, setPrevFrameTime ] = useState(now());
  const [ ms, setMs ] = useState(0);

  useEffect(() => {
    const framerateMs = 1000; // Number of ms to make each "frame" to come out to 60fps

    const leafErickson = () => {
      setPrevFrameTime(oldPrevFrameVal => {
        const currentTime = now();
        const difference = currentTime - oldPrevFrameVal;

        // setMs((oldMs) => oldMs + difference);

        return currentTime;
      });

      console.log('the ms:', ms);
      if (ms > 5) {
        console.log('blah blah');
        clearInterval(interval);
      }
    };

    const interval = setInterval(leafErickson, framerateMs);

    // console.log('set up interval');

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const currentTime = now();
    const difference = currentTime - prevFrameTime;

    console.log({ currentTime, prevFrameTime, difference });
    setMs(oldMs => oldMs + difference);
  }, [ prevFrameTime ]);

  const elapsed = prevFrameTime - startingTime;

  return (
    <div>
      <div>Elapsed: { elapsed }</div>
      <div>Total MS: { ms }</div>
    </div>
  );
};

export default Test1;
