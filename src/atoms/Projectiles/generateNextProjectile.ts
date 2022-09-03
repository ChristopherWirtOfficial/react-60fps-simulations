import { Box, Moveable, BaseProjectileDefinition, ProjectileIntention } from 'types/Boxes';
import simulateCollision from './simulateCollision';

// Construct the "next" projectile I would fire if I were to fire a projectile right now
// @param baseProjectile - The base projectile to use, tells us things like speed and damage, etc.
// @param target - The target to shoot at
// @returns The next projectile that would be fired from this configuration
// TODO: Make it so the target can be a Box or a Moveable by checking for movementSteps, or firing straight at the box otherwise
const generateNextProjectile = (baseProjectile: BaseProjectileDefinition, target: Moveable | Box) => {
  if (!Object.hasOwn(target, 'movementSteps')) {
    // TODO: Handle if it's just a static box, like a painted target, but really just a literal set of coordinates (and a size)
    throw new Error('Unimplemented - Target must have movementSteps for now');
  }

  // Use our FANCY high-tech collision prediction algorithm to figure out where the projectile should be fired from
  const angle = simulateCollision(baseProjectile, target as Moveable);

  if (!angle) {
    throw new Error('Could not simulate collision');
  }

  // TODO: PROJECTILE SOURCES - Instead of just returning the origin, or even the player position, we should add
  //  a source property to the projectile definition that tells us where the projectile is coming from.
  return {
    x: 0,
    y: 0,
    ...baseProjectile,
    direction: angle,
    targetKey: target.key,
  } as ProjectileIntention;
};

export default generateNextProjectile;
