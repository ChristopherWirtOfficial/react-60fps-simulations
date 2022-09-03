import React, { FC } from 'react';
import useTick, { getTickFunctors } from 'hooks/useTick';
import { useAtomValue } from 'jotai/utils';
import { SpawnProjectile } from 'atoms/Projectiles/ProjectileAtomFamily';
import { useSetAtom } from 'jotai';
import DefaultProjectile from 'atoms/Projectiles/DefaultProjectile';
import generateNextProjectile from 'atoms/Projectiles/generateNextProjectile';
import { MAX_TARGET_DISTANCE, TICKS_BETWEEN_ATTACKS } from 'helpers/knobs';
import { Box } from '@chakra-ui/react';
import ClosestEnemySelector from '../atoms/Enemies/ClosestEnemySelector';
import useProjectileKeys from '../atoms/Projectiles/useProjectileKeys';

import ProjectileComp from './Projectile';

const ourProjectileDef = { ...DefaultProjectile };

const useFireProjectiles = () => {
  const spawnProjectile = useSetAtom(SpawnProjectile);

  const closestEnemy = useAtomValue(ClosestEnemySelector);


  useTick(() => {
    if (!closestEnemy) {
      // TODO: Instead of skipping the attack, we should do something smarter
      return;
    }

    const nextProjectile = generateNextProjectile(ourProjectileDef, closestEnemy);
    spawnProjectile(nextProjectile);
  }, TICKS_BETWEEN_ATTACKS);
};

const PlayerProjectiles: FC = () => {
  const { projectileKeys } = useProjectileKeys();
  useFireProjectiles();

  return (
    <div className="player-projectiles">

      <Box
        pos="absolute"
        width={ `${MAX_TARGET_DISTANCE}px` }
        height={ MAX_TARGET_DISTANCE }
        rounded="full"
        border="4px solid red"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
      />
      <div>Projectiles: { projectileKeys.length } </div>
      <div>Registered Functors: { getTickFunctors().length } </div>
      {
        projectileKeys.map(key => <ProjectileComp key={ key } projectileKey={ key } />)
      }
    </div>
  );
};

export default PlayerProjectiles;

