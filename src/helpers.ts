export const now = () => performance.now();

// When going in 10 steps from 0 to 100... you don't increment by 10
export const calcPercentProgress = (frame: number, steps: number) => {
  const extraBit = 1 / (1 - 1 / steps);
  const regularPercent = ((frame % steps) / steps) * 100;

  const actualPercent = extraBit * regularPercent;

  return actualPercent;
};
