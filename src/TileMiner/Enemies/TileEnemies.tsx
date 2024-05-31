import { useAtomValue } from 'jotai';
import { FC } from 'react';
import { TileEnemyIdentifer } from 'types/TileEnemy';
import TilesInViewport from 'TileMiner/Tiles/Camera/TilesInViewportAtom';
import { EnemyIsDead } from './atoms/HandleEnemyDeath';

import { TileEnemyIDList } from './atoms/TileEnemyAtoms';
import TileEnemy from './TileEnemy';

// This exists to control the atomic access of any individual tile information at all, especially anything
//   that could change frequently accross all tiles that TileEnemies could render
//   - Since it's hook based, we need a component for each tile. Otherwise, any change causes a rerender of all tiles
//   - Since other reactive information that a TileEnemy could rely upon may change frequently, we want to just not render
//       a real TileMiner at all in some cases (i.e. when the enemy is dead)
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
