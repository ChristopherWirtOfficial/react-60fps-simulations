import { atom, useAtom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { TileEnemyIdentifer } from 'types/TileEnemy';

// These two things are intrinsically paired
// TODO: Consider deriving the BenchedDudes from the TotalDudesAvailable and assigned dudes
//         - I think we'd probably have to keep a list or log of dudes being assigned but idk
export const TotalDudesAvailable = atom(1);
export const BenchedDudes = atom(1);

export const TileEnemyAssignedDudes = atomFamily(
  (enemyId: TileEnemyIdentifer) => atom(0),
);

export const useAssignedDudes = (enemyId: TileEnemyIdentifer) => {
  const [ assignedDudes, setAssignedDudes ] = useAtom(TileEnemyAssignedDudes(enemyId));
  const [ benchedDudes, setBenchedDudes ] = useAtom(BenchedDudes);


  const assignDudesFromBench = (amount: number) => {
    const remainingDudes = benchedDudes - amount;
    const workingAmount = remainingDudes > 0 ? amount : benchedDudes;

    setBenchedDudes(oldBenchedDudes => oldBenchedDudes - workingAmount);
    setAssignedDudes(oldAssignedDudes => oldAssignedDudes + workingAmount);
  };

  const benchAssignedDudes = (amount: number) => {
    const remainingDudes = assignedDudes - amount;
    const workingAmount = remainingDudes > 0 ? amount : assignedDudes;

    setBenchedDudes(oldBenchedDudes => oldBenchedDudes + workingAmount);
    setAssignedDudes(oldAssignedDudes => oldAssignedDudes - workingAmount);
  };

  const addAssignedDude = () => {
    assignDudesFromBench(1);
  };

  const benchAssignedDude = () => {
    benchAssignedDudes(1);
  };

  const clearTileDudes = () => {
    benchAssignedDudes(Infinity);
  };

  return { assignedDudes, addAssignedDude, clearTileDudes, benchAssignedDude };
};
