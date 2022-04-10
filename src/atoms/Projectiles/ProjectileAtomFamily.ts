import { atom, atomFamily, selector, selectorFamily } from 'recoil';

import ClosestEnemySelector from '../Enemies/ClosestEnemySelector';
import PlayerPositionAtom from '../Player/PlayerPositionAtom';

export type Projectile = {
  key: string;

  x: number;
  y: number;
  size: number;
  speed: number;
  direction: number; // The angle (in radians?) that the projectile is traveling
  damage: number;
  color?: string;
};

// TODO: I should seriously reconsider spawning projecticles by just using an atomFamily

export const ProjectileAtomFamily = atomFamily<Projectile, string>({
  key: 'Projectile',
  default: selectorFamily({
    key: 'ProjectileDefaultSelector',
    get: key => ({ get }) => {
      const { x: playerX, y: playerY } = get(PlayerPositionAtom);
      const closestEnemy = get(ClosestEnemySelector);
      // If there's no enemy, don't fire at anything. Idk how we would handle this actually lmao
      // Do I need to prune this list every tick somehow?
      // Should I put the current tick in an atom and do effects based on that? That sounds neat
      if (!closestEnemy) {
        // TODO: PICKUP: Where do I actually initiate this from?
        // I think I need to know more about recoil, because it's too annoying to delete if there's no closest enemy
        //  at create time, but I don't want to do that right now. Goodnight. Sleep tight. Bitch head.
      }
      const radiansTowardClosestEnemy = closestEnemy ?
        Math.atan2((closestEnemy.y - playerY), (closestEnemy.x - playerX)) :
        0;

      return {
        key,
        x: playerX,
        y: playerY,
        size: 10,
        speed: 5,
        direction: radiansTowardClosestEnemy,
        damage: 10,
      } as Projectile;
    },
  }),
  effects: key => [
    ({ resetSelf, onSet }) => {
      onSet(newValue => {
        // TODO: What is this doing? Does this make any sense still? It's kind of hidden and magic, whatever it is
        // console.log('got a new value!', key, newValue);
        if (newValue === null) {
          resetSelf();
        }
        return newValue;
      });
    },
  ],

});

export const ProjectileKeyListAtom = atom<string[]>({
  key: 'ProjectileKeyList',
  default: [],
});

export const ProjectileListSelector = selector<Projectile[]>({
  key: 'ProjectileListSelector',
  get: ({ get }) => {
    const keyList = get(ProjectileKeyListAtom);
    const projectiles = keyList.map(key => get(ProjectileAtomFamily(key)));

    // Idk why I have to do this, so it must mean something else with they types is wrong
    return projectiles as Projectile[];
  },
});
