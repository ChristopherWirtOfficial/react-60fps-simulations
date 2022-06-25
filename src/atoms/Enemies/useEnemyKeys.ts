import { useAtom } from 'jotai';
import useTick, { FRAMERATE } from '@hooks/useTick';
import { useAtomCallback } from 'jotai/utils';
import EnemyIDListAtom from './EnemyIDListAtom';
import { uuid } from '../../helpers';
import { DESIRED_ENEMY_SPAWN_RATE, MAX_ENEMIES } from '../../knobs';


const useEnemyKeys = () => {
  const [enemyIDList] = useAtom(EnemyIDListAtom);

  const addEnemy = useAtomCallback((get, set) => {
    set(EnemyIDListAtom, oldVal => [...oldVal, uuid()]);
  });

  const desiredSpawnRate = DESIRED_ENEMY_SPAWN_RATE;
  const perTickSpawnChance = desiredSpawnRate / FRAMERATE;
  useTick(() => {
    // Every tick, roll a random number and see if we should spawn a new enemy

    const roll = Math.random();
    // @ts-ignore Just shut your mouth smartass
    if (roll < perTickSpawnChance && (MAX_ENEMIES === -1 || enemyIDList.length < MAX_ENEMIES)) {
      // Spawn a new enemy by adding one to the list of enemies with a random position outside of the screen
      addEnemy();
    }

    // If the random number is less than the chance of spawning an enemy, then spawn one
  });


  return enemyIDList;
};

export default useEnemyKeys;
