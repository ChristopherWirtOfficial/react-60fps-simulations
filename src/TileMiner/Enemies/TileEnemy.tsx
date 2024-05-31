import { Box } from '@chakra-ui/react';
import { useAtomValue, useSetAtom } from 'jotai';
import { FC, PropsWithChildren, useEffect, useMemo } from 'react';
import { TileEnemyIdentifer } from 'types/TileEnemy';

import useTileStyles from 'TileMiner/Tiles/Tile/useTileStyles';
import TileEnemyDebug from 'TileMiner/Debugging/TileEnemyDebug';
import HandleEnemyDeath from './atoms/HandleEnemyDeath';
import { TileEnemySelectorFamily } from './atoms/TileEnemyAtoms';
import { useAssignedDudes } from './Dudes/TileEnemyDudesAtoms';
import TileEnemyDudes from './Dudes/TileEnemyDudes';
import { NeighborTilesByRange, useReassignDudes } from './Dudes/DudeInfectionAtoms';

const easeInCirc = (x: number) => 1 - Math.sqrt(1 - x ** 2);

const TileEnemyComp: FC<{ enemyId: TileEnemyIdentifer }> = ({ enemyId }) => {
  const tileEnemy = useAtomValue(TileEnemySelectorFamily(enemyId));
  const { health } = tileEnemy;


  const reassignDudesToNeighbor = useReassignDudes(enemyId);

  // If the enemy is dead, kill it (since we track death independently as a static lookup. Either it is forever now, or it isn't yet. This should change exactly once instead of on all hits, etc. like health)
  const handleTileDeath = useSetAtom(HandleEnemyDeath);

  const { assignedDudes, addAssignedDude } =
    useAssignedDudes(enemyId);

  console.log('Re-rendering TileEnemy if Spamming forever', enemyId, assignedDudes);


  const anyDudesActiveOnTile = assignedDudes > 0;

  // Enemy death handling
  useEffect(() => {
    if (health <= 0) {
      handleTileDeath(enemyId);

      reassignDudesToNeighbor();
    }
  }, [
    health,
    handleTileDeath,
    enemyId,
    reassignDudesToNeighbor,
  ]);

  const styles = useTileStyles(tileEnemy);

  const healthPercentage = health / tileEnemy.maxHealth;

  const borderWidth = 3 * easeInCirc(healthPercentage);

  return (
    <Box
      onClick={ addAssignedDude }
      { ...styles }
      bg={ tileEnemy.color }
      border={ `${borderWidth}px solid white` }
    >
      <CenteredReadout>{ health }</CenteredReadout>
      <TileEnemyDebug tileEnemy={ tileEnemy } />
      { anyDudesActiveOnTile && <TileEnemyDudes enemyId={ enemyId } /> }
    </Box>
  );
};

export default TileEnemyComp;

const CenteredReadout: FC<PropsWithChildren> = ({ children }) => (
  <Box
    pos='absolute'
    top='50%'
    left='50%'
    transform='translate(-50%, -50%)'
    fontSize='20'
    color='white'
  >
    { children }
  </Box>
);
