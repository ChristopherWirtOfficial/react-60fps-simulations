import { atom } from 'jotai';
import { atomFamily, RESET } from 'jotai/utils';
import { compareTileEnemyIdentifiers, TileEnemyIdentifer } from 'types/TileEnemy';

import { TileEnemySelectorFamily } from './TileEnemyAtoms';

export const EnemyIsDead = atomFamily((enemyId: TileEnemyIdentifer) => atom(false), compareTileEnemyIdentifiers);

const HandleEnemyDeath = atom(null, (get, set, enemyId: TileEnemyIdentifer) => {
  set(EnemyIsDead(enemyId), true);

  // TODO: I think RESET is the wrong thing to do here, I should double check..
  // Is it just creating a new one that's the default again? Or does it
  //  actually clear it and only get re-created because of the list?
  set(TileEnemySelectorFamily(enemyId), RESET);
});

export default HandleEnemyDeath;
