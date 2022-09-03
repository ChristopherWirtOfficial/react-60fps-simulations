export const PLAYER_SIZE = 20;

export const TICK_FACTOR = 0.5;

export const TICKS_BETWEEN_ATTACKS = 10;
export const BASE_PROJECTILE_SPEED = 50;
export const ACCELERATION_FACTOR = 0.0;
export const MAX_PROJECTILE_SPEED = 50;
export const PROJECTILE_SIZE = 10;
export const MAX_TARGET_DISTANCE = 350;

// Every tick there's a DESIRED_ENEMY_SPAWN_RATE / FRAMERATE chance of spawning an enemy (I guess lol)
export const DESIRED_ENEMY_SPAWN_RATE = 1;
export const ENEMY_DEATH_TIMEOUT = 300;
export const ENEMY_SPEED = 5;

export const ORBIT_RADIUS = 150;
export const ORBIT_EAGERNESS = 30;

// After switching to Jotai the Hard max seems to be 500, especially when calculating
//   the distance between the player and the enemy when it takes a huge performance hit.
export const MAX_ENEMIES = 10; // Soft cap of 300 probably

export const MIN_ENEMY_SIZE = 10;
export const MAX_ENEMY_SIZE = 30;


// If we fall more than the max behind, don't try to catch up too far
// NOTE: I THINK THAT KEEPING THIS AT 1 IS THE ONLY THING THE FRAMECAPS THE TICKS.
//  Otherwise I think we try to run ticks as fast as setTimeout allows, which is almost certainly not the right approach lmao
export const MAX_QUEUED_TICKS = 1;

export const MAX_EXECUTED_TICKS = 0; // Set to 0 for no limit


// Debug flags
export const SHOW_FPS = true;
export const SHOW_AXIS = false;
export const SHOW_ENEMY_ANGLE = false;
export const SHOW_ENEMY_INSERTION_POINT = false;