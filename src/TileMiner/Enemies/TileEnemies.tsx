import { useAtomValue } from 'jotai';
import { FC } from 'react';
import { TileEnemyIdentifer } from 'types/TileEnemy';
import TilesInViewport from 'TileMiner/Tiles/Camera/TilesInViewportAtom';
import { EnemyIsDead } from './atoms/HandleEnemyDeath';

import { TileEnemyIDList } from './atoms/TileEnemyAtoms';
import TileEnemy from './TileEnemy';

const TileEnemyWrapper: FC<{ enemyId: TileEnemyIdentifer }> = ({ enemyId }) => {
  // const shouldRender = useAtomValue(ShouldEnemyRenderAtomFamily(enemyId));
  const enemyIsDead = useAtomValue(EnemyIsDead(enemyId));

  if (enemyIsDead) {
    return null;
  }

  return (
    <TileEnemy enemyId={ enemyId } />
  );
};


const TileEnemies: FC = () => {
  const enemiesGrid = useAtomValue(TileEnemyIDList);
  const tilesInViewport = useAtomValue(TilesInViewport);

  const enemiesInViewport = enemiesGrid.filter(enemyId => {
    const { gridX, gridY } = enemyId;

    return tilesInViewport.some(tile => tile.gridX === gridX && tile.gridY === gridY);
  });

  return (
    <>
      { enemiesInViewport.map(enemyId => (
        <TileEnemyWrapper key={ `${enemyId.gridX}-${enemyId.gridY}` } enemyId={ enemyId } />
      )) }
    </>
  );
};

export default TileEnemies;
