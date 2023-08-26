import { Box, Flex } from '@chakra-ui/react';
import { FC } from 'react';

const size = '1.2rem';

export const TileEnemyDudeBox: FC = ({ children }) => (
  <Box w={ size } h={ size } bg='gray.500' boxShadow='md'>
    { children }
  </Box>
);

export const TileEnemyDudesList: FC = ({ children }) => (
  <Flex wrap='wrap' p={ 1.5 } justifyContent='left' gap={ 1.5 } flex='1'>{ children }</Flex>
);
