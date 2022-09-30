import { useAtomValue } from 'jotai';
import { FC } from 'react';

import { EnemiesToRender } from './atoms/TileEnemyAtoms';
import TileEnemy from './TileEnemy';

const TileEnemies: FC = () => {
  const enemiesGrid = useAtomValue(EnemiesToRender);

  return (
    <>
      { enemiesGrid.map(enemyId => (
        <TileEnemy key={ enemyId.key } enemyId={ enemyId } />
      )) }
    </>
  );
};

export default TileEnemies;
