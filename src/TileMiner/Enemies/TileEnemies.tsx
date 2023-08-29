import { useAtomValue } from 'jotai';
import { FC } from 'react';
import { TileEnemyIdentifer } from 'types/TileEnemy';
import { EnemyIsDead } from './atoms/HandleEnemyDeath';
import ShouldEnemyRenderAtomFamily from './atoms/ShouldEnemyRenderFamily';

import { TileEnemyIDList } from './atoms/TileEnemyAtoms';
import TileEnemy from './TileEnemy';

const TileEnemyWrapper: FC<{ enemyId: TileEnemyIdentifer }> = ({ enemyId }) => {
  const shouldRender = useAtomValue(ShouldEnemyRenderAtomFamily(enemyId));
  const enemyIsDead = useAtomValue(EnemyIsDead(enemyId));

  if (enemyIsDead || !shouldRender) {
    return null;
  }

  return (
    <TileEnemy enemyId={ enemyId } />
  );
};


const TileEnemies: FC = () => {
  const enemiesGrid = useAtomValue(TileEnemyIDList);
  console.log(enemiesGrid);

  return (
    <>
      { enemiesGrid.map(enemyId => (
        <TileEnemyWrapper key={ `${enemyId.gridX}-${enemyId.gridY}` } enemyId={ enemyId } />
      )) }
    </>
  );
};

export default TileEnemies;
