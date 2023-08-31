import { Box, Text } from '@chakra-ui/react';
import { TILE_ENEMY_DEBUG_ON } from 'helpers/knobs';
import { FC, useRef } from 'react';
import { TileEnemy } from 'types/TileEnemy';


export const useRenderCount = () => {
  const renderCount = useRef(0);
  renderCount.current += 1;

  return renderCount.current;
};


const TileEnemyDebug: FC<{ tileEnemy: TileEnemy }> = ({ tileEnemy }) => {
  const {
    gridX, gridY,
  } = tileEnemy;

  const renderCount = useRenderCount();

  if (!TILE_ENEMY_DEBUG_ON) {
    return null;
  }

  return (
    <Box
      fontSize='12'
      fontWeight='semibold'
      color='lightgray'
      p={ 2 }
      lineHeight='1em'
    >
      <Text>
        ({ gridX }, { gridY })
      </Text>
      <Text>
        { renderCount }
      </Text>
      { /* <Text>
        { x.toFixed(0) }, { y.toFixed(0) }
      </Text> */ }
    </Box>
  );
};

export default TileEnemyDebug;
