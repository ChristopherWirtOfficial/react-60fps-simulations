import { Box } from '@chakra-ui/react';
import { useAtomValue, useSetAtom } from 'jotai';
import { FC, useEffect } from 'react';
import { TileEnemyIdentifer } from 'types/TileEnemy';

import useTileStyles from 'TileMiner/Tiles/Tile/useTileStyles';
import TileEnemyDebug from 'TileMiner/Debugging/TileEnemyDebug';
import { useAtomCallback } from 'jotai/utils';
import HandleEnemyDeath from './atoms/HandleEnemyDeath';
import { TileEnemySelectorFamily } from './atoms/TileEnemyAtoms';
import { useAssignedDudes } from './Dudes/TileEnemyDudesAtoms';
import TileEnemyDudes from './Dudes/TileEnemyDudes';

const TileEnemyComp: FC<{ enemyId: TileEnemyIdentifer }> = ({ enemyId }) => {
  const tileEnemy = useAtomValue(TileEnemySelectorFamily(enemyId));
  const { health, hits } = tileEnemy;
  // If the enemy is dead, kill it
  const handleTileDeath = useSetAtom(HandleEnemyDeath);

  const { assignedDudes, addAssignedDude, clearTileDudes } = useAssignedDudes(enemyId);

  const dudesActiveOnTile = assignedDudes > 0;

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
      <CenteredReadout health={ health } />
      <TileEnemyDebug tileEnemy={ tileEnemy } />
      {
        dudesActiveOnTile && <TileEnemyDudes enemyId={ enemyId } />
      }
    </Box>
  );
};


export default TileEnemyComp;


const CenteredReadout: FC<{ health: number }> = ({ health }) => (
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
