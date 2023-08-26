import { TICK_LENGTH } from 'hooks/useTick';
import { atom } from 'jotai';

// Input variables
export const rFactor = atom(1.01);
export const currentInterval = atom(60);

// Runtime variables
export const totalWidgetsProduced = atom(1);
export const totalCyclesCompleted = atom(1);

export const lastProductionTime = atom(Date.now());


// Dervived runtime variables
export const nextProductionAmountAtom = atom(get => {
  const total = get(totalWidgetsProduced);
  const cycles = get(totalCyclesCompleted);
  const r = get(rFactor);

  return (total / cycles) ** r;
});

export const nextProductionTime = atom(get => {
  const last = get(lastProductionTime);

  return last + TICK_LENGTH;
});


// Runtime Write Atoms
export const produceWidget = atom(null, (get, set) => {
  const amount = get(nextProductionAmountAtom);
  const time = get(nextProductionTime);

  set(totalWidgetsProduced, amount);
  set(totalCyclesCompleted, get(totalCyclesCompleted) + 1);
  set(lastProductionTime, Date.now());
});
