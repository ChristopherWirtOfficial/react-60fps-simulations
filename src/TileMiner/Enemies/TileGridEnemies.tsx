import { useAtomValue } from 'jotai';
import React, { FC } from 'react';
import { TileGridOnscreenEnemyIDList } from 'TileMiner/Enemies/atoms/TileGridEnemyAtoms';

import TileGridEnemy from './TileGridEnemy';

const TileGridEnemies: FC = () => {
  const enemiesGrid = useAtomValue(TileGridOnscreenEnemyIDList);

  return (
    <>
      { enemiesGrid.map(enemyId => (
        <TileGridEnemy key={ enemyId.key } enemyId={ enemyId } />
      )) }
    </>
  );
};

export default TileGridEnemies;
