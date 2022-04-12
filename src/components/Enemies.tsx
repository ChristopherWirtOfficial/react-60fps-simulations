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
      <div style={ {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        border: '2px solid green',
        borderRadius: '50%',
        width: `${2 * ORBIT_RADIUS - 2}px`,
        height: `${2 * ORBIT_RADIUS - 2}px`,
      } }
      >{ ' ' }
      </div>
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

