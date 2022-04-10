import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const now = () => performance.now();

// When going in 10 steps from 0 to 100... you don't increment by 10
export const calcPercentProgress = (frame: number, steps: number) => {
  const extraBit = 1 / (1 - 1 / steps);
  const regularPercent = ((frame % steps) / steps) * 100;

  const actualPercent = extraBit * regularPercent;

  return actualPercent;
};

export const getDistance = (x1: number, y1: number, x2: number, y2: number) => {
  const xDiff = x1 - x2;
  const yDiff = y1 - y2;
  return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
};

export const uuid = uuidv4;

// NOTE: This throttle is UNTESTED because I implemented it (from partial copy/paste) for log, but then I didn't use it.
const throttle = (callback: Function, time: number) => {
  // initialize throttlePause variable outside throttle function
  let throttlePause: boolean;

  const throt = () => {
  // don't run the function if throttlePause is true
    if (throttlePause) return;

    // set throttlePause to true after the if condition. This allows the function to be run once
    throttlePause = true;

    // setTimeout runs the callback within the specified time
    setTimeout(() => {
      callback();

      // throttlePause is set to false once the function has been called, allowing the throttle function to loop
      throttlePause = false;
    }, time);
  };

  return throt;
};

