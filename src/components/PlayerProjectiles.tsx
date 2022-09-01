import React, { FC } from 'react';
import useTick from 'hooks/useTick';
import { useAtomCallback, useAtomValue } from 'jotai/utils';
import NextProjectile from 'atoms/Projectiles/NextProjectile';
import { ProjectileAtomFamily } from 'atoms/Projectiles/ProjectileAtomFamily';
import ClosestEnemySelector from '../atoms/Enemies/ClosestEnemySelector';
import useProjectileKeys from '../atoms/Projectiles/useProjectiles';

import ProjectileComp from './Projectile';
import { TICKS_BETWEEN_ATTACKS } from '../knobs';
import { getTickFunctors } from '../hooks/useTick';

const PlayerProjectiles: FC = () => {
  const { projectileKeys, addProjectile } = useProjectileKeys();

  // TODO: ... Could this be an iterator? Or an atom generator? Hmm...
  // TODO: Make this into a write atom instead
  const spawnProjectile = useAtomCallback((get, set) => {
    const key = addProjectile();

    const newProjectile = get(NextProjectile);

    set(ProjectileAtomFamily(key), newProjectile);
  });

  const closestEnemy = useAtomValue(ClosestEnemySelector);


  // TODO: Would it be smarter to use a sngle callback function and pass it directly to useTick?
  //    Basically, wrap the closestEnemy check in the callback and pass that directly to useTick.
  //  Theoretically, it would save "unnecessary" re-renders, but I think that basically doesn't apply here :/
  // For the record, I doubt it would be a performance gain, but a lot of small things like that could be huge idk
  // TODO: Find a good permenant spot for this, obviously it'll be tied to the player and their attack speed.
  // Attacks!
  useTick(async () => {
    // Small note, but useTick or useTick(..., 40) neither one will inherently cause re-renders.
    // This one does, because it does modify reactive state that causes re-renders of the projectileKeys, but a useTick doesn't force a re-render.

    if (closestEnemy) {
      spawnProjectile();
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

