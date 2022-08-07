import { useCallback } from 'react';
import { useAtom } from 'jotai';
import { uuid } from '@helpers';

import { ProjectileKeyListAtom } from './ProjectileAtomFamily';

/*
  This hook is used to manage the list of projectiles.
  It is used to add, remove, and update projectiles.

  Crucially, it does NOT actually keep a list of the underlying projectiles, since those change very very often.
  They are not typically our concern, so don't care about them
*/
const useProjectileKeys = () => {
  const [ projectileKeys, setProjectileKeys ] = useAtom(ProjectileKeyListAtom);

  const addProjectile = useCallback(() => {
    const key = uuid();
    console.warn('the key', key);
    const newKeyList = [ ...projectileKeys, key ];

    setProjectileKeys(newKeyList);

    return key;
  }, [ setProjectileKeys, projectileKeys ]);

  const removeProjectile = useCallback((key: string) => {
    const newKeyList = projectileKeys.filter(k => k !== key);
    setProjectileKeys(newKeyList);
  }, [ setProjectileKeys, projectileKeys ]);

  return {
    projectileKeys,
    addProjectile,
    removeProjectile,
  };
};

export default useProjectileKeys;
