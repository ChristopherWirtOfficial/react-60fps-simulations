import { useAtom } from 'jotai';

import { Projectiles } from './ProjectileAtomFamily';
import useProjectileKeys from './useProjectileKeys';

/*
  Manage an individual projectile.

  Entirely generic, not specific to any game.
*/
const useProjectileAtom = (key: string) => {
  const [ projectile, setProjectileAtom ] = useAtom(Projectiles(key));
  const { removeProjectile } = useProjectileKeys();

  return {
    projectile,
    setProjectileAtom,
    removeProjectile,
  };
};

export default useProjectileAtom;
