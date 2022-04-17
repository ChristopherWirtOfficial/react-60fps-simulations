/*

  Defines how a projectile physics state item searches for collisions among enemies

  As many times as I want to think it, this has nothing to do with useMovement, they just both exist as complex tick functors lmao

*/

import useTick from './useNewTick';


const useCollision = (projectileKey: string) => {
  useTick(({ state, get }) => {
    const [ projectileState, setProjectile ] = get(projectileKey);


    return {
      ...state,
    };
  });
};

export default useCollision;
