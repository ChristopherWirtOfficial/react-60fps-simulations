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
// TODO: PICKUP - Switch this to use a static list and track death on a per-enemy basis
const TileEnemies: FC = () => {
  const enemiesGrid = useAtomValue(TileEnemyIDList);

  return (
    <>
      { enemiesGrid.map(enemyId => (
        <TileEnemyWrapper key={ enemyId.key } enemyId={ enemyId } />
      )) }
    </>
  );
};

export default TileEnemies;
