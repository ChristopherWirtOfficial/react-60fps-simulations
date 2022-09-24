import accelerateProjectile from 'hooks/Entities/movement-steps/accelerateProjectile';
import { Projectile } from 'types/Boxes';
import { BASE_PROJECTILE_SPEED, PROJECTILE_SIZE } from '../../helpers/knobs';

// TODO: Make a decision about the type of this (key or no key) and the current ProjectileIntentions in general
const DefaultProjectile: Projectile = {
  key: 'DEFAULT_PROJECTILE',
  x: 0,
  y: 0,
  speed: BASE_PROJECTILE_SPEED,
  size: PROJECTILE_SIZE,
  damage: 0,
  color: '#000',
  targetKey: undefined,
  direction: 0,
  movementSteps: [ accelerateProjectile ],
};

export default DefaultProjectile;
