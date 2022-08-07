import { uuid } from '../../helpers';
import { ENEMY_SPEED, MAX_ENEMY_SIZE, MIN_ENEMY_SIZE, ORBIT_RADIUS } from '../../knobs';
import { Entity, Damageable, useEntities } from './EntityProvider';

interface Enemy extends Entity, Damageable { }

// NOTE: THIS WHOLE FILE IS LEFTOVER FROM THE ENTITY PROVIDER STUFF

const createEnemy = (): Enemy => {
  const key = uuid();

  // Randomly sized between 15 and 50
  const size = Math.floor(Math.random() * (MAX_ENEMY_SIZE - MIN_ENEMY_SIZE)) + MIN_ENEMY_SIZE;


  const distanceFromOrigin = ORBIT_RADIUS * 4;// Math.floor(biggestDimension);
  const angle = Math.random() * 2 * Math.PI;
  // console.log(`Enemy ${key} is ${distanceFromOrigin} away from the origin at an angle of ${angle}`);
  const x = distanceFromOrigin * Math.cos(angle);
  const y = distanceFromOrigin * Math.sin(angle);

  // The angle that the enemy is pointing back toward the 0,0 origin from their x,y position
  const direction = Math.atan2(-y, -x);

  const orbitRadius = ORBIT_RADIUS * (Math.random() * 0.5 + 0.5);

  // Modify the speed as a proportion of the distance from the origin the enemy should orbit
  // This lead sto a cool effect where the enemies have a nearly identical orbital period, independent of radius
  const speed = ENEMY_SPEED * (orbitRadius / ORBIT_RADIUS);

  const newEnemy: Enemy = {
    key,
    type: 'enemy',
    x,
    y,
    size,
    speed,
    health: 100,
    maxHealth: 100,
    orbitRadius,
    // Pick a random color from rgb values with high contrast to white
    color: `rgb(${Math.floor(Math.random() * 220)}, ${Math.floor(Math.random() * 220)}, ${Math.floor(Math.random() * 220)})`,
    direction,
  };

  return newEnemy;
};

// LEFTOVER from when I started working on an Entity Provider
const useEnemies = () => {
  const { entities, updateEntity, addEntity, removeEntity } = useEntities();

  const enemies = Object.values(entities).filter(entity => entity.type === 'enemy');

  const addEnemy = () => {
    const newEnemy = createEnemy();
    addEntity(newEnemy);
  };

  const updateEnemy = (enemy: Enemy) => {
    updateEntity(enemy);
  };

  const removeEnemy = (enemy: Enemy) => {
    removeEntity(enemy.key);
  };

  return {
    enemies,
    addEnemy,
    updateEnemy,
    removeEnemy,
  };
};
