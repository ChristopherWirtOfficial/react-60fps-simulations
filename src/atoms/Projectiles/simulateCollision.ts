import executeMovementVector from 'hooks/Entities/movement-steps/executeMovementVector';
import { collapseMovementSteps } from 'hooks/Entities/useMovement';
import { Moveable, BaseProjectileDefinition } from 'types/Boxes';
import DefaultProjectile from './DefaultProjectile';

// The maximum number of ticks to simulate forward into the future to try and detect if a collision is possible
// Because I plan to always make collisions possible, this is set to be a large number.
const MAX_SIMULATION_TICKS = 10000;

let SIMULATING = false;

export const isSimulating = () => SIMULATING;

const simulateCollisionImpl = (baseProjectile: BaseProjectileDefinition, target: Moveable) => {
  let simulatedTarget = { ...target } as Moveable;
  let simulatedProjectile = {
    ...DefaultProjectile,
    ...baseProjectile,
  } as Moveable;

  for (let tick = 0; tick < MAX_SIMULATION_TICKS; tick++) {
    // Find the distance from the player to both the enemy and projectile
    const enemyDistance = Math.hypot(simulatedTarget.x, simulatedTarget.y);
    const projectileDistance = Math.hypot(simulatedProjectile.x, simulatedProjectile.y);

    // If the distance is less than the enemy's speed, we've hit the enemy.
    const distanceDelta = enemyDistance - projectileDistance;

    if (distanceDelta < 0.1) {
      // Calculate the angle to the origin of the enemy.
      const finalAngle = Math.atan2(simulatedTarget.y, simulatedTarget.x);

      return finalAngle;
    }

    // Run all of the movement steps on the enemy and projectile
    // COOL: I specifically use the simulatedTarget/Projectile here because it supports dynamic movement steps lol
    //  Theoretically, I could use a movement step to return a cloned projectile/enemy that has different movement steps,
    //   exactly like I do with the angle/speeed/x/y of all moveables in the movement steps already.

    const newEnemy = collapseMovementSteps(simulatedTarget);
    const newProjectile = collapseMovementSteps(simulatedProjectile);

    // Update the tracked state of the simulated target and projectile
    simulatedTarget = newEnemy;
    simulatedProjectile = newProjectile;
  }
  console.error(
    `Enemy/Projectile Collision Simulation ended without a result after ${MAX_SIMULATION_TICKS} ticks`,
    'This shouldn\t happen, and indicates that the enemy is too far away to be hit by the projectile.',
    'This is probably a bug, check movement steps to ensure enemies/projectiles are not:',
    '\t - moving too fast',
    '\t - moving too slowly',
    '\t - moving in the wrong direction',
    'Or if the problem is in the enemy:',
    target,
    simulatedProjectile,
  );

  return undefined;
};

const simulateCollision = (baseProjectile: BaseProjectileDefinition, target: Moveable) => {
  SIMULATING = true;
  const angle = simulateCollisionImpl(baseProjectile, target);
  SIMULATING = false;

  return angle;
};

export default simulateCollision;
