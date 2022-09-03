/*
  Box - Something that can be positioned on the screen
  Moveable - Something that can be moved with MovementSteps
*/
export interface Box {
  key: string;
  x: number;
  y: number;
  size: number;
  color?: string;
}


/*
  Moveable boxes operate with vectors that are acted upon by specified Movement Step functions.

  Movement Steps are functions that take a Moveable box and return a new Moveable box.
  They are mutators that can act on the box's x, y, direction, and speed.
*/
export interface Moveable extends Box {
  // The actual movement vector to execute on every movement tick
  speed: number;
  direction: number;

  orbitRadius?: number;

  movementSteps: MovementStep<Moveable>[];

  prevX?: number;
  prevY?: number;

  // lenny-face emoji - One day... ;)
  // rotationSpeed: number;
  // rotation: number;
}

/*
  MovementSteps - functors that take a Moveable box and return a new Moveable box.
*/
export type MovementStep<T extends Moveable> = (box: T) => T;


export interface Enemy extends Moveable {
  x: number;
  y: number;
  speed: number;
  health: number;
  maxHealth: number;
  damage: number;
  color: string;
  direction: number;

  // Random debug bullshit lol
  insertionPointX?: number;
  insertionPointY?: number;
  insertionAngle?: number;
  tangentAngle?: number;
}

/*
  Projectile - A moveable that can be fired at a target with a damage
*/
export interface Projectile extends Moveable {
  readonly key: string;
  damage: number;
  target: Moveable;

  // TODO: Projectile sources
  // sourceKey?: string;
  sourceX: number;
  sourceY: number;
}

/*
  ProjectileAtomDefinition - What we store in the actual atom family vs what we expose as the projectile
*/
export interface ProjectileAtomDefinition extends Omit<Projectile, 'target'> {
  targetKey: string;
}

// TS type for the ProjectileIntention, a Projectile without a `key` property
export type ProjectileIntention = Omit<ProjectileAtomDefinition, 'key'>;

/*
  The base definition for any given new projectile, the base ingredients you need to know
   other than the target and simulation results.
*/
export type BaseProjectileDefinition = Omit<ProjectileIntention, 'x' | 'y' | 'direction' | 'targetKey'>;

