import { Box, Text } from '@chakra-ui/react';
import useBoxStyles from 'hooks/Entities/useBoxStyles';
import { useAtomValue } from 'jotai';
import React, { FC } from 'react';
import { TileEnemy, TileEnemyIdentifer, TileGridEnemyAtomFamily } from 'TileMiner/Enemies/atoms/TileGridEnemyAtoms';


const TileGridEnemyDebug: FC<{ tileEnemy: TileEnemy }> = ({ tileEnemy }) => {
  const {
    gridX, gridY,
  } = tileEnemy;
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
      { /* <Text>
        { x.toFixed(0) }, { y.toFixed(0) }
      </Text> */ }
    </Box>
  );
};

const TileGridEnemy: FC<{ enemyId: TileEnemyIdentifer }> = ({ enemyId }) => {
  const tileEnemy = useAtomValue(TileGridEnemyAtomFamily(enemyId));

  const styles = useBoxStyles(tileEnemy);

  const { health } = tileEnemy;

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
      <Box
        pos='absolute'
        top='50%'
        left='50%'
        transform='translate(-50%, -50%)'
        fontSize='20'
        color='white'
      >{ health }
      </Box>
      <TileGridEnemyDebug tileEnemy={ tileEnemy } />
    </Box>
  );
};


export default TileGridEnemy;
