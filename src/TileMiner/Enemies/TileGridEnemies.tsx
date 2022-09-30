import { useAtomValue } from 'jotai';
import React, { FC } from 'react';
import { EnemiesToRender } from './atoms/TileGridEnemyAtoms';

import TileGridEnemy from './TileGridEnemy';

const TileGridEnemies: FC = () => {
  const enemiesGrid = useAtomValue(EnemiesToRender);

  return (
    <>
      { enemiesGrid.map(enemyId => (
        <TileGridEnemy key={ enemyId.key } enemyId={ enemyId } />
      )) }
    </>
  );
};

export default TileGridEnemies;
