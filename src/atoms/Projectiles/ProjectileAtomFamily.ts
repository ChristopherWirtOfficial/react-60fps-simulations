import { atom } from 'jotai';
import { atomFamily, atomWithReset } from 'jotai/utils';
import { Projectile, ProjectileAtomDefinition, ProjectileIntention } from 'types/Boxes';
import { uuid } from 'helpers';
import EnemyAtomFamily from 'atoms/Enemies/EnemyAtomFamily';

// NOTE: Keep in mind, this approach might make very little sense by the time we
//  have multiple projectile sources, or types of projectiles

// This holds all of the data except for the target, since it would get stale
// TODO: Consider not exposing the atom family at all, and just using Derived write atoms or something
// The API certainly requires a way to get the actual underlying atom (or a facsimilie thereof),
// and the only way to do that right now is off of the atom family directly
export const ProjectileAtomFamily = atomFamily((key: string) => atomWithReset<ProjectileAtomDefinition>(null!));

// The target is stored in the EnemyAtomFamily, but pulled into the Projectiles selector family to keep it all fresh
export const Projectiles = atomFamily((key: string) => atom<Projectile, ProjectileAtomDefinition>(get => {
  const projectile = get(ProjectileAtomFamily(key));

  // TODO: TARGETS - Decouple targets from projectiles
  //  But also, yo I'm dumb, this literally just makes up an enemy to target if the key is fake lmao
  //  That's why all of the projectiles end up sharing a color lmao
  const target = projectile.targetKey ? get(EnemyAtomFamily(projectile.targetKey)) : null;

  return {
    ...projectile,
    target,
  } as Projectile;
}, (get, set, updateValue) => {
  set(ProjectileAtomFamily(key), updateValue);
}));

export const ProjectileKeyListAtom = atom<string[]>([]);

export const ProjectileListSelector = atom(get => {
  const keyList = get(ProjectileKeyListAtom);
  const projectiles = keyList.map(key => get(Projectiles(key)));

  return projectiles;
});


// A write atom that creates a new projectile
// NOTE: This does NO checks, it assumes that everything it's being told to do makes sense
export const SpawnProjectile = atom(null, (get, set, projectileIntention: ProjectileIntention) => {
  const key = uuid('spawned-projectile');

  const projectile: ProjectileAtomDefinition = {
    ...projectileIntention,
    key,
  };

  // NOTE: This very briefly creates a "default" projectile, which is `null!`.
  //  This should be totally fine though, because it's immediately overwritten, and most
  //  importantly, it's written to again before it's EVER read from, since the only consumers rely on the key
  //  being in the key list to even know it exists.
  set(ProjectileAtomFamily(key), projectile);
  set(ProjectileKeyListAtom, old => [ ...old, key ]);
});
