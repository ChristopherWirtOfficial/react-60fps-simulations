import React, { FC, useRef, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { useAtomValue } from 'jotai';
import useScreen from '../atoms/Screen/useScreen';
import PlayerProjectiles from '../components/PlayerProjectiles';
import Enemies from '../components/Enemies';
import Player from '../components/Player';
import { ScreenDimensionsSelector } from '../atoms/Screen/ScreenNodeAtom';
import MousePositionAtom from '../atoms/MousePositionAtom';
import useTick from '../hooks/useTick';
import { SHOW_FPS, SHOW_AXIS } from '../knobs';

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


const useStyles = createUseStyles({
  container: {
    position: 'relative',
    backgroundColor: 'palegoldenrod',
    width: '560px',
    height: '800px',
  },
});


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

const DrawTest: FC = () => {
  const {
    screenRef, // A ref to the screen element, which we'll attach to the container div ourselves.
  } = useScreen();
  const classes = useStyles();


  // TODO move the player position to be a selector off of the actual pixel position value from a ref for the player
  //   and then place the player on the screen with normal HTML and css.
  // ^ I think that's done lol
  const { width, height } = useAtomValue(ScreenDimensionsSelector);


  const { x, y } = useAtomValue(MousePositionAtom);

  // TODO: Read this about how I'm a genius lmao -
  //   Because of how I've set this up, it'll be fucking trivial to re-create the gamefield with a different interface, like SVG or something.


  return (
    <div ref={ screenRef } className={ classes.container }>
      <div>
        Center: { width / 2 } x { height / 2 }
      </div>
      <div>
        Mouse: { x } x { y }
      </div>
      {
        SHOW_FPS && (
          <FPSCounter />
        )
      }
      {
        SHOW_AXIS && (
          <>
            <div style={ {
              position: 'absolute',
              top: height / 2,
              left: 0,
              width: '100%',
              height: '1px',
              backgroundColor: 'red',
            } }
            >{ ' ' }
            </div>
            <div style={ {
            // vertical line from center to top
              position: 'absolute',
              top: 0,
              left: width / 2,
              width: '1px',
              height: '100%',
              backgroundColor: 'blue',
            } }
            >{ ' ' }
            </div>
          </>
        )
      }

      <Player />
      <Enemies />
      <PlayerProjectiles />
    </div>
  );
};

export default DrawTest;
