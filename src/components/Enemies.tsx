import React, { FC } from 'react';

import { useRecoilCallback } from 'recoil';
import useTick from '../hooks/useTick';
import useEnemyKeys from '../atoms/Enemies/useEnemyKeys';
import useLog from '../hooks/useLog';
import EnemyComp from './Enemy';
import EnemyAtomFamily from '../atoms/Enemies/EnemyAtomFamily';
import { ORBIT_RADIUS } from '../knobs';


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

