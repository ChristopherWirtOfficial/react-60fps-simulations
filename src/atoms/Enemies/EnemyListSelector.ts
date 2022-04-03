import { selector } from 'recoil';
import EnemyAtomFamily from './EnemyAtomFamily';
import EnemyIDListAtom from './EnemyIDListAtom';

export default selector({
  key: 'EnemyList',

  get: ({ get }) => {
    const enemyIDList = get(EnemyIDListAtom);
    const enemies = enemyIDList.map(id => get(EnemyAtomFamily(id)));

    return enemies;
  },
});
