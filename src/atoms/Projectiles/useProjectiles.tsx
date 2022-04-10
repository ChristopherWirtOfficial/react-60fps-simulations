import { useRecoilState } from 'recoil';
import { uuid } from '@helpers';

import { ProjectileKeyListAtom } from './ProjectileAtomFamily';

/*
  This hook is used to manage the list of projectiles.
  It is used to add, remove, and update projectiles.

  Crucially, it does NOT actually keep a list of the underlying projectiles, since those change very very often.
  They are not typically our concern, so don't care about them
*/
const useProjectileKeys = () => {
  const [ projectileKeys, setProjectileKeys ] = useRecoilState(ProjectileKeyListAtom);

  const addProjectile = () => {
    const key = uuid();
    const newKeyList = [ ...projectileKeys, key ];

    setProjectileKeys(newKeyList);
  };

  const removeProjectile = (key: string) => {
    const newKeyList = projectileKeys.filter(k => k !== key);
    setProjectileKeys(newKeyList);
  };

  return {
    projectileKeys,
    addProjectile,
    removeProjectile,
  };
};

export default useProjectileKeys;
