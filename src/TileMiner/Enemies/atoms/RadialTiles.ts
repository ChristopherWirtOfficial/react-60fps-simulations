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
  radius: number;
  arcLengthInRad: number;
  width: number;
  height: number;
}

const RING_1_TILE_COUNT = 4;

// TODO: The TILE_WIDTH_RATIO isn't beigng respected in the ways I'd expect at all
//       The scaling factor seems highly skewed, I'm wondering if we
//         further scale one or both of these numbers separately
const TILE_WIDTH_RATIO = 30;

// We take our desired number of tiles in ring 1, and our desired height of ring 1, and calculate the width of each tile
export const TILE_WIDTH = 2 * Math.PI / RING_1_TILE_COUNT;
export const TILE_HEIGHT = TILE_WIDTH / TILE_WIDTH_RATIO;

// The conversion ratio from arc length to pixels
// TODO: This doesn't seem to be even CLOSE to the sizes I'd expect from this ratio
// I think there's something to be said about the TILE_WIDTH_RATIO and the number of tiles in ring 1
// TODO: Why can't I make the tiles thinner/wider using my current methods?
// The ratios cancel out in ways that ... don't make sense to me
export const RADIAL_TILE_SIZE = 600;


export const ringInfo = (ring: number) => {
  const radius = (ring + 1);
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
  };
};

// Generate a list of all the tiles in a radial pattern for a given ring
export const generateRing = (ring: number): RadialTile[] => {
  const { radius: ringRadius, tileCount, perTileLeftoverShare, leftoverSpace } = ringInfo(ring);
  // console.log('Leftover', perTileLeftoverShare, leftoverSpace);
  // TODO: I don't thnk the leftover stuff is working right
  const arcLengthInRad = (TILE_WIDTH + perTileLeftoverShare);
  // const arcLengthInRad = TILE_WIDTH;

  const height = TILE_HEIGHT * RADIAL_TILE_SIZE;
  const width = arcLengthInRad * RADIAL_TILE_SIZE;
  const radius = ringRadius * height;

  const ringCoords = Array.from({ length: tileCount }, (_, index) => ({
    ring,
    index,
    radius,
    height,
    width,
    arcLengthInRad,
  }));

  return ringCoords;
};
