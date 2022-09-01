import { atom } from 'jotai';
import PlayerPositionAtom from '../Player/PlayerPositionAtom';
import EnemyListSelector from './EnemyListSelector';
import { getDistance } from '../../helpers';
import { Enemy } from './';
import { ProjectileListSelector } from '../Projectiles/ProjectileAtomFamily';

// Select the closest enemy that isn't already targeted by another projectile
const ClosestEnemySelector = atom(get => {
  const { x: playerX, y: playerY } = get(PlayerPositionAtom);
  const enemies = get(EnemyListSelector);
  const projecticles = get(ProjectileListSelector);

  // Reduce across all enemies, keeping track of an anon object with the closest enemy and its distance
  const closestEnemy = enemies.reduce<{ distance: Number, enemy: Enemy | null }>((closest, enemy) => {
    const distance = getDistance(playerX, playerY, enemy.x, enemy.y);
    const isTargeted = projecticles.some(projectile => projectile.targetKey === enemy.key);

    if (distance < closest.distance && !isTargeted) {
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
});

export default ClosestEnemySelector;
