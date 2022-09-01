import { isSimulating } from 'atoms/Projectiles/NextProjectile';
import { ACCELERATION_FACTOR, MAX_PROJECTILE_SPEED } from '../../../knobs';
import { Moveable, MovementStep } from '../useMovement';

// A basic movement step that accelerates the projectile
const accelerateProjectile: MovementStep<Moveable> = projectile => {
  const { speed } = projectile;

  if (isSimulating()) {
    // console.log('SIMULATING acceleration', projectile);
  } else {
    console.log('REALLY accelerating', projectile);
  }

  return {
    ...projectile,
    speed: Math.min(speed + (ACCELERATION_FACTOR * speed), MAX_PROJECTILE_SPEED),
  };
};

export default accelerateProjectile;
