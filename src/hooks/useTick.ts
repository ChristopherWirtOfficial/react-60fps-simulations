import { useEffect, useState } from 'react';
// TODO: This file needs to be cleaned and code-split pretty urgently!
// Probably going to keep kicking the can until I actually start making game content and need specific useTick features
import { now, uuid } from '../helpers';

export type TickFunctor = {
  readonly id: string;
  readonly functor: () => void;
  readonly frequency: number;
};

export const FRAMERATE = 60;
const TICK_LENGTH = 1000 / FRAMERATE;

// If we fall more than the max behind, don't try to catch up too far
//  Note: probably want to make this considerably higher than 10 ticks?
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

// The main tick execution loop function, looped with setTimeout(deferPulse)
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

    // Find the functors to run this tick. The value of the functor's key in the functorsToSkipMap is the number of ticks until it should run next.
    const functorsToRun = tickFunctors.filter(f => functorsToSkipMap[f.id] === 0);

    tickFunctors.forEach(f => {
      // Update each functor's associated "ticks until next run" count in the map.
      functorsToSkipMap[f.id] = functorsToSkipMap[f.id] === 0 ? f.frequency - 1 : functorsToSkipMap[f.id] - 1;
    });

    // Run all the functors that need to be run
    // console.log(functorsToRun.map(f => f.frequency));
    const times = functorsToRun.map(f => {
      const startTime = now();
      f.functor();

      return now() - startTime;
    });

    const reportTimes = () => {
      console.log(times);
      const totalTimeExecuting = times.reduce((a, b) => a + b, 0);
      const timeUntilNextTick = TICK_LENGTH - leftoverTickTime - (now() - currentTickTime);
      console.log('TIME UNTIL NEXT TICK', timeUntilNextTick);
      console.log('Percent of time used this tick', totalTimeExecuting / TICK_LENGTH);
      console.log('Percent of time used this tick', totalTimeExecuting / timeUntilNextTick);
    };
    // Enable to see some valuable timing statistics
    // reportTimes();

    tickLatch--;
  };

  for (let currentTickInQueue = 0; currentTickInQueue < ticksQueued; currentTickInQueue++) {
    tick();
  }
  // PULSE END CODE
};

const deferPulse = () => {
  pulse('setTimeout');
  setTimeout(deferPulse);
};

setTimeout(deferPulse);

/*
  @param functor: The function to run component-level code (or any logic) per tick cadance
  @param frequency: How many ticks between each execution of the functor
*/
const useTick = (functorArg: () => void, frequency = 1) => {
  const [ id ] = useState(uuid());
  const [ progress, setProgress ] = useState(0);

  /*
    This useEffect will register or re-register a functor for the static `id` of this hook instance.
    For every use of the useTick hook, an ID is generated and remains static to the hook instance. We
    can rely on this to stay static between renders and across functor re-registrations.

    The functor used in a component, unless wrapped in a useCallback, will not be referrentialyl stable. This is
    overall a pretty useful attribute, as long as the re-registration overhead is minimal.

    Because of the lack of referential stability, every re-render we'll get a brand new reference to a brand new functor that
     has 0 stale references to other Reactive properties, instead of letting them get stale in the old functor that was passed in.
  */
  useEffect(() => {
    const functor = () => {
      // TODO: This is like this to let us track progress, but that code wasn't working. It's in git somewhere, but also it didn't work lol
      // setProgress here or something
      functorArg();
    };

    const newTickFunctors = tickFunctors.filter(f => f.id !== id);
    newTickFunctors.push({ id, functor, frequency });

    // Even if we re-register, we keep the same ID and consider ourselves the same functor.
    // Because of this, we only set a value for the functorsToSkipMap if there isn't one already. If there is, we don't change it.
    // This lets us keep the same cooldown between executions as the last functor, even though it was re-registered (every render, usually)
    if (functorsToSkipMap[id] === undefined) {
      functorsToSkipMap[id] = 0;
    }

    // TODO: NOTE: When re-registering because the frequency changed, don't reset the functorsToSkipMap value to zero. Instead,
    //  increase or decrease it by the difference between the old and new frequency. This way, the functor will be run next at the new frequency.
    //  This could be useful as a way to almost directly tie something like attack speed to the frequency of the tick, and get a lot of good stuff for free.


    tickFunctors = newTickFunctors;
    return () => {
      tickFunctors = tickFunctors.filter(f => f.functor !== functor);
    };
  }, [ id, functorArg, frequency ]);

  return { progress };
};

export default useTick;
