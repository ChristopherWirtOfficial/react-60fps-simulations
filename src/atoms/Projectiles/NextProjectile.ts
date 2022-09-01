import { atom } from 'jotai';
import executeMovementVector from 'hooks/Entities/movement-steps/executeMovementVector';
import { Moveable } from 'hooks/Entities/useMovement';
import ClosestEnemySelector from '../Enemies/ClosestEnemySelector';
import PlayerPositionAtom from '../Player/PlayerPositionAtom';
import { DefaultProjectile, Projectile } from './ProjectileAtomFamily';
import { uuid } from 'helpers';

// The maximum number of ticks to simulate forward into the future to try and detect if a collision is possible
// Because I plan to always make collisions possible, this is set to be a large number.
const MAX_SIMULATION_TICKS = 10000;

let SIMULATING = false;

export const isSimulating = () => SIMULATING;

// A projectile whose target is the closest enemy
const NextProjectile = atom<Projectile>(get => {
  const closestEnemy = get(ClosestEnemySelector);

  if (!closestEnemy) {
    throw new Error('No closest enemy, that should have been checked before "firing" a projectile');
  }

  const { x, y } = get(PlayerPositionAtom);
  const closestEnemyMovementSteps = [...closestEnemy.movementSteps, executeMovementVector];
  const projectileMovementSteps = [...DefaultProjectile.movementSteps, executeMovementVector];

  // Simulate the projectile and enemy for up to MAX_SIMULATION_TICKS ticks or until they "collide".
  // They "collide" when the projectile is the roughly same distance from the player as the enemy on any given tick.

  // TODO: Consider generecizing this and ... Idk, just generally making it feel better
  const simulateCollision = () => {
    let enemy = { ...closestEnemy } as Moveable;
    let projectile = { ...DefaultProjectile } as Moveable;

    for (let tick = 0; tick < MAX_SIMULATION_TICKS; tick++) {
      // Find the distance from the player to both the enemy and projectile
      const enemyDistance = Math.hypot(enemy.x, enemy.y);
      const projectileDistance = Math.hypot(projectile.x, projectile.y);

      // If the distance is less than the enemy's speed, we've hit the enemy.
      const distanceDelta = enemyDistance - projectileDistance;

      if (distanceDelta < 0.1) {
        // Calculate the angle to the origin of the enemy.
        const finalAngle = Math.atan2(enemy.y, enemy.x);

        return finalAngle;
      }

      // Run all of the movement steps on the enemy and projectile
      const newEnemy = closestEnemyMovementSteps.reduce((acc, step) => step(acc), enemy);
      const newProjectile = projectileMovementSteps.reduce((acc, step) => step(acc), projectile);
      // Update the enemy and projectile
      enemy = newEnemy;
      projectile = newProjectile;
    }
    console.error(
      `Enemy/Projectile Collision Simulation ended without a result after ${MAX_SIMULATION_TICKS} ticks`,
      'This shouldn\t happen, and indicates that the enemy is too far away to be hit by the projectile.',
      'This is probably a bug, check movement steps to ensure enemies/projectiles are not:',
      '\t - moving too fast',
      '\t - moving too slowly',
      '\t - moving in the wrong direction',
      'Or if the problem is in the enemy:',
      closestEnemy,
      projectile,
    );

    return undefined;
  };

  // The angle to shoot at to hit the closest enemy when they would intercept
  SIMULATING = true;
  const angle = simulateCollision();
  SIMULATING = false;

  if (!angle) {
    throw new Error('Could not simulate collision');
  }

  const targetKey = closestEnemy.key;

  return {
    ...DefaultProjectile,
    key: `projectile-${uuid()}`,
    direction: angle,
    targetKey,
  };
});

export default NextProjectile;
