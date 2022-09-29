import { Box, Text } from '@chakra-ui/react';
import { TileEnemy, TileEnemyIdentifer, TileGridEnemyAtomFamily } from 'atoms/Enemies/TileEnemies/TileGridEnemies';
import useBoxStyles from 'hooks/Entities/useBoxStyles';
import { useAtomValue } from 'jotai';
import React, { FC } from 'react';


const TileGridEnemyDebug: FC<{ tileEnemy: TileEnemy }> = ({ tileEnemy }) => {
  const {
    x, y, gridX, gridY,
  } = tileEnemy;
  return (
    <Box
      fontSize='20'
      fontWeight='bold'
      color='white'
    >
      <Text>
        { gridX }, { gridY }
      </Text>
      <Text>
        { x.toFixed(0) }, { y.toFixed(0) }
      </Text>
    </Box>
  );
};

const TileGridEnemy: FC<{ enemyId: TileEnemyIdentifer }> = ({ enemyId }) => {
  const tileEnemy = useAtomValue(TileGridEnemyAtomFamily(enemyId));

  const styles = useBoxStyles(tileEnemy);

  // TODO: Position the enemy based on the x and y coordinates
  return (
    <Box
      pos='absolute'
      top={ 0 }
      left={ 0 }
      right={ 0 }
      bottom={ 0 }
      w={ `${tileEnemy.size}px` }
      h={ `${tileEnemy.size}px` }
      bg={ tileEnemy.color }
      transform={ styles.transform }
      border='1px solid white'

    >
      <TileGridEnemyDebug tileEnemy={ tileEnemy } />
    </Box>
  );
};


export default TileGridEnemy;
