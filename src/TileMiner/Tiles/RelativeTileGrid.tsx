// The goal of this is to have a chakra UI forwardRef (or whatever) component
//  that takes
//   - an `origin` location in game coords
//  and then offers relative positioning for that origin

// Theoretically, you can then also use one at the root level
//  to get a relative positioning for the whole game from 0,0
// (while still being able to use one elsewhere for relative positioning)

import { Box, BoxProps, forwardRef } from '@chakra-ui/react';
import { GameCoords } from 'types/Game';
import { TileGridOriginProvider, useTileGridOrigin } from './TileGridOriginProvider';

type TileGridBoxProps = BoxProps & { origin?: GameCoords, absolute?: boolean };

const RelativeTileGrid = forwardRef<TileGridBoxProps, 'div'>(
  ({ children, origin = { x: 0, y: 0 }, ...props }, ref) => {
    const { absolute = false } = props;

    const parentOrigin = useTileGridOrigin();

    // If we're absolute, then we use the origin as-is
    const combinedOrigin = absolute ? origin : {
      x: parentOrigin.x + origin.x,
      y: parentOrigin.y + origin.y,
    };

    return (
      <TileGridOriginProvider origin={ combinedOrigin }>
        { children }
      </TileGridOriginProvider>
    );
  },
);

export const RootTileGrid = forwardRef<TileGridBoxProps, 'div'>(
  ({ children, origin = { x: 0, y: 0 }, ...props }, ref) => (
    <Box
      ref={ ref }
      { ...props }
    >
      <TileGridOriginProvider origin={ origin }>
        { children }
      </TileGridOriginProvider>
    </Box>
  ),
);

export default RelativeTileGrid;
