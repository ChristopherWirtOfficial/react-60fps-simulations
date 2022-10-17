export interface RadialTileCoords {
  ring: number;
  index: number;
}

// TODO: I don't think the size actually ... matters?
// It just confuses the math. What a given Tile really needs to know about itself is:
//   - What percentage of the ring it makes up (how many tiles are in the ring, basically)
//   - What percentage of the ring it is (its index)
// I'm not ready to give up on `index` vs angle (or percent of the way around the ring)
export interface RadialTile extends RadialTileCoords {
  width: number;
  height: number;
}

const RING_1_TILE_COUNT = 8;
// Each tile is 3x as wide as it is tall
const TILE_WIDTH_RATIO = 3;
const BASE_TILE_SIZE = (2 * Math.PI) / (RING_1_TILE_COUNT * 3);

// 3x1 for now idk
const TILE_WIDTH = BASE_TILE_SIZE * TILE_WIDTH_RATIO;
const TILE_HEIGHT = BASE_TILE_SIZE;

const RING_PADDING = 0.1;


// NOTE: I have to be able to go backwards with ALL of this as well
// I need to be able to know the GameCoords of something and deterministically know the RadialTileCoords of it
//  and of course, vice versa (right? Of course..?)

export const ringInfo = (ring: number) => {
  // Ring 0 is just the center tile
  const radius = ring * TILE_WIDTH * (1 + RING_PADDING);
  const circumference = 2 * Math.PI * radius;

  // How many tiles can fit in the circumference of the ring
  const tileCount = Math.floor(circumference / TILE_WIDTH);

  // How much space is left over after fitting all the tiles in the circumference
  const leftoverSpace = circumference - tileCount * TILE_WIDTH;

  // Every tile gets a lil baby sliver of the leftover space
  const perTileLeftoverShare = leftoverSpace / tileCount;

  return {
    radius,
    circumference,
    tileCount,
    leftoverSpace,
    perTileLeftoverShare,
  };
};

// Generate a list of all the tiles in a radial pattern for a given ring
export const generateRing = (ring: number): RadialTile[] => {
  const { tileCount, perTileLeftoverShare } = ringInfo(ring);

  const ringCoords = Array.from({ length: tileCount }, (_, index) => ({
    ring,
    index,
    height: TILE_HEIGHT,
    width: TILE_WIDTH + perTileLeftoverShare,
  }));

  return ringCoords;
};
