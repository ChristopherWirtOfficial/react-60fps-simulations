import { Box, Text } from '@chakra-ui/react';
import useBoxStyles from 'hooks/Entities/useBoxStyles';
import { useAtom, useSetAtom } from 'jotai';
import { FC, useEffect, useRef } from 'react';
import { TileEnemy, TileEnemyIdentifer } from 'types/TileEnemy';

import HandleEnemyDeath from './atoms/HandleEnemyDeath';
import { TileEnemySelectorFamily } from './atoms/TileEnemyAtoms';

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

const TileEnemyComp: FC<{ enemyId: TileEnemyIdentifer }> = ({ enemyId }) => {
  // TODO: PICKUP potentially - useTileEnemy instead
  const [ tileEnemy, setTileEnemy ] = useAtom(TileEnemySelectorFamily(enemyId));
  const { health, hits } = tileEnemy;
  // If the enemy is dead, kill it
  const handleEnemyDeath = useSetAtom(HandleEnemyDeath);

  useEffect(() => {
    if (health <= 0) {
      handleEnemyDeath(enemyId);
    }
  }, [ health, handleEnemyDeath, enemyId ]);


  const styles = useBoxStyles(tileEnemy);

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
      >
        { /* Put stuff in here to show on the enemy */ }
        { health }
      </Box>
      <TileEnemyDebug tileEnemy={ tileEnemy } />
    </Box>
  );
};


export default TileEnemyComp;
