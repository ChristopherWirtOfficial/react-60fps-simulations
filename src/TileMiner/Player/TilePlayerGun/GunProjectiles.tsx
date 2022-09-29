import useProjectileKeys from 'atoms/Projectiles/useProjectileKeys';
import React from 'react';

import ProjectileComp from '../../../components/Projectile';

/*
 We don't actually have to nest the GunProjectiles under anything,
 since what we plan to do is spawn them in based on the position of the gun
 that's shooting them (which is static for now, I guess).

 The next steps are: (See extra notes in the copy of this in Evernote)
 - Basic useTick to spawn projectiles using the existing system -- DONE
 - Render the projectiles in the scene -- DONE
 - Make the projectiles move -- DONE
 - Make the projectiles collide with the Enemy Tiles
 - Make the projectiles disappear when they hit the enemy
 - Make the enemies take damage when hit
 - Make the enemy tiles disappear when they take enough damage
 - Destruction animation for both of these
 */

// TODO: PICKUP - Make the projectiles collide with the enemy tiles

// TODO: This should probably take the gun it's shooting from as an argument at some point
//   ^^ Pretty much the same/other half of the note from useGun lol
const GunProjectiles = () => {
  const { projectileKeys } = useProjectileKeys();

  return (
    <>
      { projectileKeys.map(key => <ProjectileComp key={ key } projectileKey={ key } />) }
    </>
  );
};

export default GunProjectiles;
