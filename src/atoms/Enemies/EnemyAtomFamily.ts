import React from 'react';
import { atomFamily, selectorFamily } from 'recoil';
import { ENEMY_SPEED, MIN_ENEMY_SIZE, ORBIT_RADIUS, MAX_ENEMY_SIZE } from '../../knobs';
import { ScreenDimensionsSelector } from '../Screen/ScreenNodeAtom';
import { Moveable } from '../../hooks/Entities/useMovement';

// TODO: LATER My types are still bad lol
export interface Enemy extends Moveable {
  key: string;

  x: number;
  y: number;
  size: number;
  speed: number;
  health: number;
  maxHealth: number;
  damage: number;
  color: string;
  direction: number;


  insertionPointX?: number;
  insertionPointY?: number;
  insertionAngle?: number;
  tangentAngle?: number;
}

export default atomFamily<Enemy, string>({
  key: 'Enemy',

  default: selectorFamily({
    key: 'EnemyDefaultSelector',
    get: key => ({ get }) => {
      // Randomly sized between 15 and 50
      const size = Math.floor(Math.random() * (MAX_ENEMY_SIZE - MIN_ENEMY_SIZE)) + MIN_ENEMY_SIZE;

      // Randomly positioned a specific distance away from the origin at a random angle
      const { width, height } = get(ScreenDimensionsSelector);
      const biggestDimension = Math.max(width, height);

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
        x,
        y,
        size,
        speed,
        health: 100,
        maxHealth: 100,
        damage: 10,
        orbitRadius,
        // Pick a random color from rgb values with high contrast to white
        color: `rgb(${Math.floor(Math.random() * 220)}, ${Math.floor(Math.random() * 220)}, ${Math.floor(Math.random() * 220)})`,
        direction,
      };

      return newEnemy;
    },
  }),
});

