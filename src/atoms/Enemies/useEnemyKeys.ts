import { useState } from 'react';
import { useRecoilCallback, useRecoilValue, useRecoilState } from 'recoil';
import useTick, { FRAMERATE } from '@hooks/useTick';
import useInitScreen from '../Screen/useScreen';
import { Enemy } from './EnemyAtomFamily';
import EnemyIDListAtom from './EnemyIDListAtom';
import EnemyListSelector from './EnemyListSelector';
import { uuid } from '../../helpers';
import { DESIRED_ENEMY_SPAWN_RATE, MAX_ENEMIES } from '../../knobs';


const useEnemyKeys = () => {
  const [ enemyIDList ] = useRecoilState(EnemyIDListAtom);

  const addEnemy = useRecoilCallback(({ set }) => () => {
    set(EnemyIDListAtom, oldVal => [ ...oldVal, uuid() ]);
  }, []);

  const desiredSpawnRate = DESIRED_ENEMY_SPAWN_RATE;
  const perTickSpawnChance = desiredSpawnRate / FRAMERATE;
  useTick(() => {
    // Every tick, roll a random number and see if we should spawn a new enemy

    const roll = Math.random();
    if (roll < perTickSpawnChance && (MAX_ENEMIES === -1 || enemyIDList.length < MAX_ENEMIES)) {
      // Spawn a new enemy by adding one to the list of enemies with a random position outside of the screen
      addEnemy();
    }

    // If the random number is less than the chance of spawning an enemy, then spawn one
  });


  return enemyIDList;
};

export default useEnemyKeys;
