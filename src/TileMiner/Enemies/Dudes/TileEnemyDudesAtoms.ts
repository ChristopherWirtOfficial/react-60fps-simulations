import { atom, useAtom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { TileEnemyIdentifer } from 'types/TileEnemy';

export const TileEnemyAssignedDudes = atomFamily(
  (enemyId: TileEnemyIdentifer) => atom(0),
);

export const useAssignedDudes = (enemyId: TileEnemyIdentifer) => {
  const [ assignedDudes, setAssignedDudes ] = useAtom(TileEnemyAssignedDudes(enemyId));

  const addAssignedDude = () => setAssignedDudes(oldAssignedDudes => oldAssignedDudes + 1);

  return { assignedDudes, addAssignedDude };
};
