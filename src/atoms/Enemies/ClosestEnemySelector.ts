import { selector } from 'recoil';
import PlayerPositionAtom from '../Player/PlayerPositionAtom';
import EnemyListSelector from './EnemyListSelector';
import { getDistance } from '../../helpers';
import { Enemy } from './EnemyAtomFamily';

export default selector({
  key: 'ClosestEnemySelector',
  get: ({ get }) => {
    const { x: playerX, y: playerY } = get(PlayerPositionAtom);
    const enemies = get(EnemyListSelector);

    // Reduce across all enemies, keeping track of an anon object with the closest enemy and its distance
    const closestEnemy = enemies.reduce<{ distance: Number, enemy: Enemy | null }>((closest, enemy) => {
      const distance = getDistance(playerX, playerY, enemy.x, enemy.y);
      if (distance < closest.distance) {
        return {
          distance,
          enemy,
        };
      }
      return closest;
    }, {
      distance: Number.MAX_SAFE_INTEGER,
      enemy: null,
    });

    return closestEnemy.enemy;
  },
});
