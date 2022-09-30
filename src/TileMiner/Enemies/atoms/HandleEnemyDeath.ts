import { atom } from 'jotai';
import { RESET } from 'jotai/utils';
import { TileEnemyIdentifer } from 'types/TileEnemy';
import { TileEnemyIDList, TileEnemySelectorFamily } from './TileEnemyAtoms';

const HandleEnemyDeath = atom(null, (get, set, enemyId: TileEnemyIdentifer) => {
  const enemyAtom = TileEnemySelectorFamily(enemyId);
  // const enemy = get(enemyAtom);

  // Remove the enemy from the list of enemies
  set(TileEnemyIDList, ids => ids.filter(({ key }) => key !== enemyId.key));

  // TODO: I think RESET is the wrong thing to do here, I should double check..
  // Is it just creating a new one that's the default again? Or does it
  //  actually clear it and only get re-created because of the list?
  set(enemyAtom, RESET);
});

export default HandleEnemyDeath;