import { TileGridEnemyIDList } from 'atoms/Enemies/TileEnemies/TileGridEnemies';
import { useAtomValue } from 'jotai';
import React, { FC } from 'react';
import TileGridEnemy from './TileGridEnemy';

const TileGridEnemies: FC = () => {
  const enemiesGrid = useAtomValue(TileGridEnemyIDList);

  return (
    <>
      { enemiesGrid.map(enemyId => (
        <TileGridEnemy key={ enemyId.key } enemyId={ enemyId } />
      )) }
    </>
  );
};

export default TileGridEnemies;
