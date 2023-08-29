import { FC } from 'react';
import { Box } from '@chakra-ui/react';

import useTileStyles from '../Tile/useTileStyles';

export const STORE_LOCATION = { gridX: -1, gridY: 1 };

const StoreTile: FC = () => {
  const storeTileStyles = useTileStyles({
    size: 1,
    key: 'Store',
    ...STORE_LOCATION,
  });

  return (
    <Box bg='red' { ...storeTileStyles }>
      The store!
    </Box>
  );
};

export default StoreTile;
