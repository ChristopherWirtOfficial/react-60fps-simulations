import { useState } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import useTick, { FRAMERATE } from '@hooks/useTick';
import useInitScreen from '../Screen/useScreen';
import { Enemy } from './EnemyAtomFamily';
import EnemyIDListAtom from './EnemyIDListAtom';
import EnemyListSelector from './EnemyListSelector';
import { uuid } from '../../helpers';


// TODO: Enemies should be kept as a state atom inside of a larger Enemies AtomFamily.
//    that contains the list of enemies? It would be a nice way to have a single point of truth for all
//    aspects of the enemies. It would mean that updating X,Y to move would be the same mechanism as setting
//    the enemies' startingX, startingY, etc.
const useEnemies = () => {
  // TODO: Use these dimensions when constructing the enemies. Might need to move the underlying value to a state atom if it's not in one.
  // PICKUP
  const { width: screenWidth, height: screenHeight } = useInitScreen();
  const enemies = useRecoilValue(EnemyListSelector);

  const addEnemy = useRecoilCallback(({ set }) => () => {
    set(EnemyIDListAtom, oldVal => [ ...oldVal, uuid() ]);
  }, []);

  // Every tick, go through the list of enemies and remove any that don't have health remaining
  useTick(() => {
    // TODO: Remove dead enemies every tick!
    // Maybe do it in the selector? Or an effect! even better
  });


  const desiredSpawnRate = 1; // 0.2 enemies per second, 1 enemy every 5 seconds at first
  const perTickSpawnChance = desiredSpawnRate / FRAMERATE;
  useTick(() => {
    // Every tick, roll a random number and see if we should spawn a new enemy

    const roll = Math.random();
    if (roll < perTickSpawnChance && enemies.length < 10) {
      // Spawn a new enemy by adding one to the list of enemies with a random position outside of the screen
      addEnemy();
    }

    // If the random number is less than the chance of spawning an enemy, then spawn one
  });


  return enemies;
};

export default useEnemies;
