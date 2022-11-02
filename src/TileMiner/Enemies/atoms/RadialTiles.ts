export interface RadialTileCoords {
  ring: number;
  index: number;
}

export interface RadialTile extends RadialTileCoords {
  radius: number;
  width: number;
  height: number;
}

// We want 4 tiles in the first ring, which we regard as having a unitless circumference of 2*PI
const RING_1_RADIUS = 1;
const RING_1_CIRCUMFERENCE = 2 * Math.PI * RING_1_RADIUS;
const RING_1_TILE_COUNT = 4;

// "Request" a pixel size for the ring to be, and derive from there
const RING_1_RADIUS_IN_PX = 50;
const PIXEL_RATIO = RING_1_RADIUS_IN_PX / RING_1_RADIUS;

export const TILE_WIDTH = (RING_1_CIRCUMFERENCE / RING_1_TILE_COUNT) * PIXEL_RATIO;

const TILE_WIDTH_RATIO = 3;

export const TILE_HEIGHT = TILE_WIDTH / TILE_WIDTH_RATIO;

// Everything is pixels here
export const ringInfo = (ring: number) => {
  const radius = (ring + 1) * TILE_HEIGHT * 1.5;
  const circumference = 2 * Math.PI * radius;

  // Probably won't be a whole number
  const tilesInCircumference = circumference / TILE_WIDTH;

  // How many tiles can fit in the circumference of the ring
  const tileCount = Math.floor(tilesInCircumference);

  // How much space is left over after fitting all the tiles in the circumference
  const leftoverSpace = (tilesInCircumference - tileCount);

  // Every tile gets a lil baby sliver of the leftover space
  const perTileLeftoverShare = leftoverSpace / tileCount;

  console.log({
    ring,
    radius,
    circumference,
    tilesInCircumference,
    tileCount,
  });

  return {
    radius,
    circumference,
    tileCount,
    leftoverSpace,
    perTileLeftoverShare,
  };
};

// Probably not needed anymore
export const RADIAL_TILE_SIZE = 1;


// Generate a list of all the tiles in a radial pattern for a given ring
export const generateRing = (ring: number): RadialTile[] => {
  const {
    radius: ringRadius, tileCount, perTileLeftoverShare, leftoverSpace,
  } = ringInfo(ring);
  // TODO: Account for leftover space (and PADDING, like for the stroke width) with this refactor

  const height = TILE_HEIGHT;
  const width = TILE_WIDTH;
  const radius = ringRadius;

  // TODO: Why am I making an entire array of identical tiles? Lmao HUGE optimization, right?
  const ringCoords = Array.from({ length: tileCount }, (_, index) => ({
    ring,
    index,
    radius,
    height,
    width,
  }));

  return ringCoords;
};
