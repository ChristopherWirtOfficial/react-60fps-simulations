import { atom } from 'jotai';
import EnemyAtomFamily from './EnemyAtomFamily';
import EnemyIDListAtom from './EnemyIDListAtom';

export default atom(get => {
  const enemyIDList = get(EnemyIDListAtom);
  const enemies = enemyIDList.map(id => get(EnemyAtomFamily(id)));

  return enemies;
});
