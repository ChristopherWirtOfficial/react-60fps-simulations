import { Box, chakra, HStack } from '@chakra-ui/react';
import { FC, PropsWithChildren } from 'react';

export const StarboardOverlay: FC = () => (
  <>
    <Box
      pos='absolute'
      top='0'
      right='0'
      left='0'
      w='100%'
      h='10px'
      bg='blue'
    />
    <Box
      pos='absolute'
      bottom='0'
      right='0'
      left='0'
      w='100%'
      h='10px'
      bg='red'
    />
  </>
);

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
