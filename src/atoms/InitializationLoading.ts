// Atoms to describe various loading states of the application,
//  typically to act as gates for the application to continue.
import { atom } from 'jotai';

import { ScreenNodeAtom } from './Screen/ScreenNodeAtom';

// For example, no ticks should be run until the screen dimensions are known
export const ScreenDimensionsLoaded = atom(get => {
  const screenNode = get(ScreenNodeAtom);

  return !!screenNode;
});

export const ReadyToShootProjectiles = atom(get => {
  const screenDimensionsLoaded = get(ScreenDimensionsLoaded);

  return screenDimensionsLoaded;
});

export const EverythingLoadedGameIsInitialized = atom(get => {
  const screenDimensionsLoading = get(ScreenDimensionsLoaded);

  return screenDimensionsLoading;
});
