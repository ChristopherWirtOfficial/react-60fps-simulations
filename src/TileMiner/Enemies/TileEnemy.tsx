import { Box, Text } from '@chakra-ui/react';
import { TILE_ENEMY_DEBUG_ON } from 'helpers/knobs';
import useBoxStyles from 'hooks/Entities/useBoxStyles';
import { useAtom, useSetAtom } from 'jotai';
import { FC, useEffect, useRef } from 'react';
import { TileEnemy, TileEnemyIdentifer } from 'types/TileEnemy';

import useTileStyles from 'TileMiner/Tiles/Tile/useTileStyles';
import HandleEnemyDeath from './atoms/HandleEnemyDeath';
import { TileEnemySelectorFamily } from './atoms/TileEnemyAtoms';
import { useAssignedDudes } from './Dudes/TileEnemyDudesAtoms';
import TileEnemyDudes from './Dudes/TileEnemyDudes';

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

const TileEnemyComp: FC<{ enemyId: TileEnemyIdentifer }> = ({ enemyId }) => {
  const [ tileEnemy, setTileEnemy ] = useAtom(TileEnemySelectorFamily(enemyId));
  const { health, hits } = tileEnemy;
  // If the enemy is dead, kill it
  const handleTileDeath = useSetAtom(HandleEnemyDeath);

  const { assignedDudes, addAssignedDude, benchAssignedDude, clearTileDudes } = useAssignedDudes(enemyId);


  useEffect(() => {
    if (health <= 0) {
      handleTileDeath(enemyId);
      clearTileDudes();
    }
  }, [ health, handleTileDeath, enemyId, clearTileDudes ]);


  const styles = useTileStyles(tileEnemy);

  return (
    <Box
      onClick={ addAssignedDude }
      { ...styles }
      bg={ tileEnemy.color }
      border='1px solid white'
    >
      <CenteredHealth health={ health } />
      <TileEnemyDebug tileEnemy={ tileEnemy } />
      <TileEnemyDudes enemyId={ enemyId } />
    </Box>
  );
};


export default TileEnemyComp;


const CenteredHealth: FC<{ health: number }> = ({ health }) => (
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
);
