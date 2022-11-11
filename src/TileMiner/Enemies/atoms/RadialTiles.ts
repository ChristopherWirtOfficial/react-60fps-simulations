export interface RadialTileCoords {
  ring: number;
  index: number;
}

export interface RadialTile extends RadialTileCoords {
  radius: number;
  angleWidth: number;
  width: number;
  height: number;
}

// "Request" a pixel size for the ring to be, and derive from there
export const RING_1_RADIUS_IN_PX = 90;

export const RING_1_CIRCUMFERENCE = 2 * Math.PI * RING_1_RADIUS_IN_PX;
const RING_1_TILE_COUNT = 5;

// TODO: Derive this value based on a stroke width and padding or something idk
export const HORIZONTAL_PADDING = 2;
export const FULL_TILE_WIDTH = (RING_1_CIRCUMFERENCE / RING_1_TILE_COUNT);
export const TILE_WIDTH = FULL_TILE_WIDTH - HORIZONTAL_PADDING;

// TODO: Same as above
export const VERTICAL_PADDING = 7;
export const FULL_TILE_HEIGHT = RING_1_RADIUS_IN_PX;
export const TILE_HEIGHT = FULL_TILE_HEIGHT - VERTICAL_PADDING;

// Everything is pixels here
// TODO: Memoize this and make it hyper efficient, it's going to be very hot
// It's just math, so optimizing it past memoization/avoiding memory allocations
//  is probably not worth it
export const ringInfo = (ring: number) => {
  const radius = ring * RING_1_RADIUS_IN_PX;
  const circumference = 2 * Math.PI * radius;

  // Probably won't be a whole number
  const tilesInCircumference = circumference / TILE_WIDTH;

  // How many tiles can fit in the circumference of the ring
  const tileCount = Math.floor(tilesInCircumference);

  // How much space is left over after fitting all the tiles in the circumference
  const leftoverSpace = (tilesInCircumference - tileCount);

  // Every tile gets a lil baby sliver of the leftover space
  const perTileLeftoverShare = leftoverSpace / tileCount;


  return {
    radius,
    circumference,
    tileCount,
    leftoverSpace,
    perTileLeftoverShare,
    tilesInCircumference,
  };
};

// Probably not needed anymore
export const RADIAL_TILE_SIZE = 1;


// Generate a list of all the tiles in a radial pattern for a given ring
export const generateRing = (ring: number): RadialTile[] => {
  const {
    radius: ringRadius, tileCount, perTileLeftoverShare,
  } = ringInfo(ring);
  // TODO: Account for leftover space (and PADDING, like for the stroke width) with this refactor

  const height = TILE_HEIGHT;
  const width = TILE_WIDTH;
  const radius = ringRadius;

  const angleWidth = (2 * Math.PI / tileCount) + perTileLeftoverShare;

  // TODO: Why am I making an entire array of identical tiles? Lmao HUGE optimization, right?
  const ringCoords = Array.from({ length: tileCount }, (_, index) => ({
    ring,
    index,
    radius,
    height,
    width,
    angleWidth,
  }));

  return ringCoords;
};
