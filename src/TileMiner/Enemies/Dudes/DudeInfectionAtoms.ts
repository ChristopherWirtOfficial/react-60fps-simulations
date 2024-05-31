import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { TileEnemyIdentifer } from 'types/TileEnemy';
import { useCallback, useMemo } from 'react';
import { TileEnemyIDList, TileEnemySelectorFamily } from '../atoms/TileEnemyAtoms';
import { EnemyIsDead } from '../atoms/HandleEnemyDeath';
import { BenchedDudes, TileEnemyAssignedDudes } from './TileEnemyDudesAtoms';

export type NeighborTileIdentifier = TileEnemyIdentifer & {
  distanceFromTile: number;
};

export type NeighborTileFamilyProps = {
  enemyId: TileEnemyIdentifer;
  range: number;
};

export const NeighborTilesByRange = atomFamily(
  ((props: NeighborTileFamilyProps) => atom(get => {
    const { enemyId, range } = props;

    const enemyTile = get(TileEnemySelectorFamily(enemyId));

    // Since we know our own coordinates, and the coordinates of a given enemy are included as part of the ID, AND especially since we HAVE to rely on a master list SOMEWHERE, we grab all of the enemy IDs (for now)
    // NOTE: This is part of what doesn't scale with infinite enemies/procedurally generated enemies. It SHOULD "just work" but it'll cause massive "chunk" updates when new enemies are added to the master list
    //   We otherwise expect this list to be, effectively, static. That lets this neighbor list, for any given enemyID and range, be roughly static itself.
    // This, crucially, lets our DYNAMIC list (LivingNeighborTilesByRange) start from the most reduced and most static possible place.
    // This is a great example of how all of those other good implications and implementations, and these good practices, make this complex function reliable and simple.
    // The logic is only complicated by implication. But the implemented logic remains simple, because most of those complexities are implied away lol
    const enemies = get(TileEnemyIDList);

    // Get all tiles within range, by grid position
    // Then return a list of tiles in range WITH their distance from the enemy tile
    const neighbors = enemies.reduce((acc, neighbor) => {
      if (neighbor.key === enemyId.key) {
        // Exclude the tile itself, since it isn't its own neighbor
        return acc;
      }

      const distanceFromTile = Math.sqrt(
        (enemyTile.gridX - neighbor.gridX) ** 2 +
        (enemyTile.gridY - neighbor.gridY) ** 2,
      );

      if (distanceFromTile <= range) {
        acc.push({ ...neighbor, distanceFromTile });
      }

      return acc;
    }, [] as NeighborTileIdentifier[]);

    return neighbors;
  })),
);

export const LivingNeighborTilesByRange = atomFamily(
  ((props: NeighborTileFamilyProps) => atom(get => {
    const { enemyId, range } = props;

    const neighbors = get(NeighborTilesByRange({ enemyId, range }));

    // Filter out dead enemies
    const livingNeighbors = neighbors.filter(neighbor => {
      const neighborIsDead = get(EnemyIsDead(neighbor));

      return !neighborIsDead;
    });

    return livingNeighbors;
  })),
);

// Use of this atom assumes that the caller is handling the assignment accounting, including only assigning those that it unassigns from itself
export const AssignDudesDirectlyToTileAtom = atom(
  null,
  (get, set, props: { enemyId: TileEnemyIdentifer, amount: number }) => {
    const { enemyId, amount } = props;

    const normalizedId: TileEnemyIdentifer = {
      gridX: enemyId.gridX,
      gridY: enemyId.gridY,
      key: enemyId.key,
    };

    console.log('Assigning dudes directly to tile', { normalizedId, amount });


    set(TileEnemyAssignedDudes(normalizedId), oldAmount => oldAmount + amount);
  },
);


export const useReassignDudes = (enemyId: TileEnemyIdentifer) => {
  // Eventually will call code that combines a list of living neighbors within a certain range (and perhaps the distance they happen to be at)
  //  with a system (for now, nearest neighbor) that selects a living neighbor and redistributes their currently assigned dudes to it/them
  // Don't worry too mcuh about controlling the selection process for now, because it's going to be complicated enough without figuring it out before implemnting a v1
  const [ assignedDudes, setAssignedDudes ] = useAtom(TileEnemyAssignedDudes(enemyId));
  const setBenchedDudes = useSetAtom(BenchedDudes);
  const assignDudesToTile = useSetAtom(AssignDudesDirectlyToTileAtom);


  // Reassign some number of our dudes (assumed accounted for already) to the target
  const reassignDudesToTile = useCallback((targetTileId: TileEnemyIdentifer, amount: number) => {
    // Handles unassigning tiles from itself and assigning them to another specific tile, never involving the bench
    assignDudesToTile({ enemyId: targetTileId, amount });
    setAssignedDudes(oldAssignedDudes => oldAssignedDudes - amount);
  }, [ setAssignedDudes, assignDudesToTile ]);


  // Get nearest neighbor list
  const tileRangeId = useMemo(() => ({ enemyId, range: 1 }), [ enemyId ]);
  const livingNeighborTiles = useAtomValue(LivingNeighborTilesByRange(tileRangeId));


  // Select a living neighbor tile. If none, bench the dudes
  const reassignDudesToNeighbor = useCallback(() => {
    if (livingNeighborTiles?.length > 0) {
      // TODO: Break out the ability to compose selection logic (or at least specify it more modularly)
      const randomIndex = Math.floor(Math.random() * livingNeighborTiles.length);
      const nearestNeighbor = livingNeighborTiles[randomIndex];

      reassignDudesToTile(nearestNeighbor, assignedDudes);
      setAssignedDudes(0);
    } else {
      setBenchedDudes(oldBenchedDudes => oldBenchedDudes + assignedDudes);
      setAssignedDudes(0);
    }
  }, [ livingNeighborTiles, reassignDudesToTile, assignedDudes, setBenchedDudes, setAssignedDudes ]);

  return reassignDudesToNeighbor;
};
