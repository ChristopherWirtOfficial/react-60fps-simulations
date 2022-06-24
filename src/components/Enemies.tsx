import React, { FC } from 'react';

import useEnemyKeys from '../atoms/Enemies/useEnemyKeys';
import EnemyComp from './Enemy';


const Enemies: FC = () => {
  const enemies = useEnemyKeys();

  return (
    <div className="enemies">
      <div>
        Enemies: { enemies.length }
      </div>
      { enemies.map(key => (
        <EnemyComp key={ key } enemyKey={ key } />
      )) }
    </div>
  );
};

export default Enemies;

