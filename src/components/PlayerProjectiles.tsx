import React, { FC, useEffect } from 'react';
import { useAtomValue } from 'jotai';
import useTick from '@hooks/useTick';
import { useAtomCallback } from 'jotai/utils';
import { Enemy } from 'src/atoms/Enemies/EnemyAtomFamily';
import useProjectileKeys from '../atoms/Projectiles/useProjectiles';
import { Projectile, ProjectileAtomFamily } from '../atoms/Projectiles/ProjectileAtomFamily';

import ProjectileComp from './Projectile';
import ClosestEnemySelector from '../atoms/Enemies/ClosestEnemySelector';
import { TICKS_BETWEEN_ATTACKS } from '../knobs';
import { getTickFunctors } from '../hooks/useTick';
import { Moveable, MovementStepsAtomFamily, stepMovementVector } from '../hooks/Entities/useMovement';
import { accelerate } from '../atoms/Projectiles/useProjectile';

const PROCECTILE_COUNT = 1;


const PlayerProjectiles: FC = () => {
  const { projectileKeys, addProjectile } = useProjectileKeys();

  const setProjectile = useAtomCallback((get, set, projData: Pick<Projectile, 'key'> & Partial<Projectile>) => {
    const { key } = projData;
    const projectile = get(ProjectileAtomFamily(key));
    set(ProjectileAtomFamily(key), { ...projectile, ...projData });
  });

  const closestEnemy = useAtomValue(ClosestEnemySelector);

  const getMovementSteps = useAtomCallback((get, set, target: Pick<Projectile, 'key'> & Partial<Moveable>) => {
    const { key } = target;

    const movementSteps = get(MovementStepsAtomFamily(key));

    return movementSteps;
  });

  const getProjectile = useAtomCallback((get, set, key: string) => {
    const projectile = get(ProjectileAtomFamily(key));
    return projectile;
  });


  // TODO: Find a good permenant spot for this, obviously it'll be tied to the player and their attack speed.
  // Attacks!
  useTick(async () => {
    // Small note, but useTick or useTick(..., 40) neither one will inherently cause re-renders.
    // This one does, because it does modify reactive state that causes re-renders of the projectileKeys, but a useTick doesn't force a re-render.

    if (closestEnemy) {
      const key = addProjectile();
      
      // TODO: This is all kind of gross tbh
      const realProjectile = getProjectile(key);

      const closestEnemyMovementSteps = [ ...(await getMovementSteps(closestEnemy)), stepMovementVector ];
      const projectileMovementSteps = [ accelerate, stepMovementVector ];

      // Simulate the projectile and enemy for up to MAX_SIMULATION_TICKS ticks or until they "collide".
      // They "collide" when the projectile is the roughly same distance from the player as the enemy on any given tick.
      const MAX_SIMULATION_TICKS = 10000;


      const simulateCollision = () => {
        let enemy = { ...closestEnemy } as Moveable;
        let projectile = { ...realProjectile } as Moveable;

        for (let tick = 0; tick < MAX_SIMULATION_TICKS; tick++) {
          // Find the distance from the player to both the enemy and projectile
          const enemyDistance = Math.hypot(enemy.x, enemy.y);
          const projectileDistance = Math.hypot(projectile.x, projectile.y);
          // console.log('BLAH', { enemy, projectile, enemyDistance, projectileDistance });

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

        return undefined;
      };

      const finalAngle = simulateCollision();

      const closestEnemyAngle = Math.atan2(closestEnemy.y, closestEnemy.x);

      setProjectile({
        key,
        direction: finalAngle ?? 0,
        targetKey: closestEnemy.key,
      });
    }
  }, TICKS_BETWEEN_ATTACKS);


  return (
    <div className="player-projectiles">
      <div>Projectiles: { projectileKeys.length } </div>
      <div>Registered Functors: { getTickFunctors().length } </div>
      {
        projectileKeys.map(key => <ProjectileComp key={ key } projectileKey={ key } />)
      }
    </div>
  );
};

export default PlayerProjectiles;

