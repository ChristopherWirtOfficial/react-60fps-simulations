import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { now } from '../helpers';

export interface TickFunctor {
  readonly id: string;
  readonly functor: () => void;
  readonly frequency: number;
}

export const FRAMERATE = 60;
const TICK_LENGTH = 1000 / FRAMERATE;

// If we fall more than the max behind, don't try to catch up too far
//  Note: probably want to make this considerably higher?
const MAX_QUEUED_TICKS = 10;

let tickFunctors: Array<TickFunctor> = [];
const functorsToSkipMap: { [key: string]: number } = {};

let lastTickTime = now();

let tickLatch = 0;

// Only simulate this number of ticks before halting
const HARD_STOP = 0;
let frameCount = 0;

const counts = {
  requestAnimationFrame: 0,
  setInterval: 0,
  setTimeout: 0,
  unspecified: 0,
};

let leftoverTickTime = 0;

const pulse = (source = 'unspecified') => {
  frameCount++;
  if (HARD_STOP > 0 && frameCount > HARD_STOP) {
    return;
  }
  // PULSE START CODE
  if (tickLatch > 0) {
    console.warn('TICK LATCH CLOSED AT PULSE START', tickLatch);
    return;
  }

  const currentTickTime = now();

  if (currentTickTime - lastTickTime < 0) {
    console.warn('TICK ELAPSED WAS NEGATIVE', currentTickTime - lastTickTime);
    console.warn('This probably means that performance.now() wrapped around above its max value, which is sorta neat.');

    // Reset the lastTickTime to 0, giving us ou
    lastTickTime = 0;
  }

  // How long has it been since we last started executing ticks?
  const elapsed = currentTickTime - lastTickTime;

  // How long it's been since the last tick + the leftover time from the last tick.
  // Basically, the remainder of our fraction * the totalRequiredTickTime
  const totalRequiredTickTime = elapsed + leftoverTickTime;

  const ticksQueued = Math.min(MAX_QUEUED_TICKS, Math.floor(totalRequiredTickTime / TICK_LENGTH));
  leftoverTickTime = totalRequiredTickTime % TICK_LENGTH;

  if (ticksQueued > 5) {
    console.warn('multiple ticks queued?', ticksQueued);
  }

  // Run as many ticks as we should queue to catch up to tickrate since the last known tick
  tickLatch = ticksQueued;
  lastTickTime = currentTickTime;

  const tick = () => {
    // @ts-ignore
    counts[source]++;
    const functorsToRun = tickFunctors.filter(f => functorsToSkipMap[f.id] === 0);
    tickFunctors.forEach(f => {
      functorsToSkipMap[f.id] = functorsToSkipMap[f.id] === 0 ? f.frequency - 1 : functorsToSkipMap[f.id] - 1;
    });

    // Run all the functors that need to be run
    // console.log(functorsToRun.map(f => f.frequency));
    functorsToRun.forEach(f => f.functor());
    tickLatch--;
  };

  for (let currentTickInQueue = 0; currentTickInQueue < ticksQueued; currentTickInQueue++) {
    tick();
  }
  // PULSE END CODE
};

// setInterval(() => pulse('setInterval'), PULSE_SPEED);

const deferPulse = () => {
  pulse('setTimeout');
  setTimeout(deferPulse);
};

setTimeout(deferPulse);


const useTick = (functorArg: () => void, frequency = 1) => {
  const [ id ] = useState(uuidv4());
  const [ progress, setProgress ] = useState(0);

  useEffect(() => {
    const functor = () => {
      // Maybe make this part optional? If the use-case doesn't care about tick-by-tick progress,
      //    they my prefer to not even re-render except when their functor actually runs
      // Alternatively, maybe make the report interval configurable? Set a number of ticks to report progress, since
      //  nothing will cause a re-render from this hook unless setProgress is called
      // setProgress(() => (frequency - functorsToSkipMap[id]) / frequency);
      functorArg();
    };

    const newTickFunctors = tickFunctors.filter(f => f.id !== id);
    newTickFunctors.push({ id, functor, frequency });
    if (functorsToSkipMap[id] === undefined) {
      functorsToSkipMap[id] = frequency - 1;
    }


    tickFunctors = newTickFunctors;
    return () => {
      tickFunctors = tickFunctors.filter(f => f.functor !== functor);
    };
  }, [ id, functorArg, frequency ]);


  // if (frequency > 1) {
  //   console.log({
  //     toSkip: functorsToSkipMap[id],
  //     frequency,
  //     diff: frequency - functorsToSkipMap[id],
  //     progress,
  //   });
  // }

  return { progress };
};

export default useTick;
