import { useAtomValue } from 'jotai';
import { useAtomCallback } from 'jotai/utils';

import { ProjectileKeyListAtom } from './ProjectileAtomFamily';

/*
  This hook is used to manage the list of projectiles.
  It is used to add, remove, and update projectiles.

  Crucially, it does NOT actually keep a list of the underlying projectiles, since those change very very often.
  They are not typically our concern, so don't care about them
*/
// TODO: Replace the contents of this hook with a write atom or two
const useProjectileKeys = () => {
  const projectileKeys = useAtomValue(ProjectileKeyListAtom);

  const removeProjectile = useAtomCallback((get, set, key: string) => {
    const currentKeys = get(ProjectileKeyListAtom);
    const newKeys = currentKeys.filter(k => k !== key);

    set(ProjectileKeyListAtom, newKeys);
  });

  return {
    projectileKeys,
    removeProjectile,
  };
};

export default useProjectileKeys;
