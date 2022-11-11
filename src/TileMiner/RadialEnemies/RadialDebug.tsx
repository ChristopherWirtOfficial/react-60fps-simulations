import { Box, chakra, HStack, VStack } from '@chakra-ui/react';
import useScreen from 'atoms/Screen/useScreen';
import { FC, PropsWithChildren, useMemo } from 'react';
import { generateRing, ringInfo, TILE_HEIGHT, TILE_WIDTH } from 'TileMiner/Enemies/atoms/radialTiles';

import useGameCoordsToRadialTiles, { useMouseGameCoords } from './RadialTile/useGameCoordsToRadialTile';

// DREAM: I still want a way for a child to be able to access the parent's state
// Can you have tons of contexts? Can they nest?
// Can you have a context that's a function that returns a context? (GH Copilot gave me that question lmao)

const DebugLabelImpl: FC<{ label: string } & PropsWithChildren> = ({ label, children }) => (
  <HStack spacing={ 1 } pr={ 2 }>
    <Box fontWeight='bold'>
      { label }:
    </Box>
    <Box>
      { children }
    </Box>
  </HStack>
);

export const DebugLabel = chakra(DebugLabelImpl);

export const LIKE_DONKEY_KONG = true;
export const LIKE_P_DIDDY = false;


const RingDebug: FC<{ ring: number }> = ({ ring }) => {
  const { radius, tileCount, circumference, tilesInCircumference } = ringInfo(ring);

  const ringTiles = useMemo(() => generateRing(ring), [ ring ]);
  const ringTile = ringTiles[0];

  return (
    <VStack
      spacing={ 0 }
      borderTop='2px solid #11111144'
      align='start'
      pt={ 3 }
    >
      <DebugLabel label='Debug Ring'>{ ring }</DebugLabel>
      <HStack>
        <DebugLabel label='"radius"'>{ radius.toFixed(2) }</DebugLabel>
        <DebugLabel label='"tileCount"'>{ tileCount.toFixed(2) }</DebugLabel>
      </HStack>
      <HStack>
        <DebugLabel label='tile width'>{ ringTile.height.toFixed(2) }</DebugLabel>
        <DebugLabel label='tile height'>{ ringTile.width.toFixed(2) }</DebugLabel>
      </HStack>
      <HStack>
        <DebugLabel label='circumference'>{ circumference.toFixed(2) }</DebugLabel>
        <DebugLabel label='tilesInCircumference'>{ tilesInCircumference.toFixed(2) }</DebugLabel>
      </HStack>
    </VStack>
  );
};

const CenterDebug: FC = () => (
  <Box
    pos='fixed'
    h='10px'
    w='10px'
    rounded='full'
    bg='red'
    zIndex={ 1500 }
    opacity={ 0.5 }
    top='50%'
    left='50%'
    transform='translate(-50%, -50%)'
  />
);

// I can show information about any given ring by putting it here
const debugRings: number[] = [];

const MouseDebug: FC = () => {
  const { mouseX, mouseY } = useScreen();
  const { x, y } = useMouseGameCoords();
  const { ring, index } = useGameCoordsToRadialTiles({ x, y });

  return (
    <Box
      bg='#DDEEDDAF'
      pos='fixed'
      zIndex={ 1500 }
      top={ mouseY! - 70 }
      left={ mouseX! - 180 }
    >
      <HStack>
        <DebugLabel label='mouseX'>{ mouseX }</DebugLabel>
        <DebugLabel label='mouseY'>{ mouseY }</DebugLabel>
      </HStack>
      <HStack>
        <DebugLabel label='x'>{ x }</DebugLabel>
        <DebugLabel label='y'>{ y }</DebugLabel>
      </HStack>
      <HStack fontSize='xl'>
        <DebugLabel label='ring'>{ ring }</DebugLabel>
        <DebugLabel label='index'>{ index }</DebugLabel>
      </HStack>
    </Box>
  );
};

const RadialDebug: FC = () => (
  <>
    <CenterDebug />
    <VStack
      pos='fixed'
      zIndex={ 1000 }
      top={ 45 }
      left={ 45 }
      bg='#DDEEDDAF'
      p={ 3 }
      align='start'
      fontSize='0.7em'
    >
      <DebugLabel label='Height'>{ TILE_HEIGHT.toFixed(4) }</DebugLabel>
      <DebugLabel label='Width'>{ TILE_WIDTH.toFixed(4) }</DebugLabel>
      <MouseDebug />
      { debugRings.map(ring => <RingDebug key={ ring } ring={ ring } />) }
    </VStack>
  </>
);

export default RadialDebug;

