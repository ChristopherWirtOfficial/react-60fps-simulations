import { useDeleteSelfWhenOffscreen, useProjectileMove } from 'atoms/Projectiles/useProjectile';
import useProjectileAtom from 'atoms/Projectiles/useProjectileAtom';
import getBoxKey from 'helpers/boxes/getBoxKey';
import checkCollisions from 'helpers/collisions/checkCollisions';
import useTick from 'hooks/useTick';
import { useAtomValue } from 'jotai';
import ProjectileTileEnemySelectorFamily from 'TileMiner/Enemies/atoms/ProjectileTileEnemySelectorFamily';
import useProjectileHit from 'TileMiner/Enemies/atoms/useProjectileHit';
import { BoxTypeOrKey, Moveable, Projectile } from 'types/Boxes';
import { TileEnemyIdentifer } from 'types/TileEnemy';

type AddProjectileHitCallback<MoveableType extends Moveable> = (projectile: MoveableType) => void;

const useProjectileCollision = <MoveableType extends Moveable>(
  key: string,
  enemies: MoveableType[],
  addProjectileHit: AddProjectileHitCallback<MoveableType>,
) => {
  const { projectile, removeProjectile } = useProjectileAtom(key);

  const checkEnemyCollisions = () => {
    const collidedEnemy = checkCollisions(projectile, enemies) as MoveableType;
    if (collidedEnemy) {
      // Call the provided callback to add an appropriate hit to the enemy
      addProjectileHit(collidedEnemy);

      // Remove ourselves, duh
      removeProjectile(key);
    }
  };


  useTick(checkEnemyCollisions);
};


const useMinerProjectile = (projectileOrKey: BoxTypeOrKey<Projectile>) => {
  const key = getBoxKey(projectileOrKey);

  const { projectile } = useProjectileAtom(key);

  // Gets only the alive enemies that are in the same neighborhood as the projectile to check for collisions
  const enemies = useAtomValue(ProjectileTileEnemySelectorFamily(key));

  const { addProjectileHit } = useProjectileHit();

  const addProjectileHitCallback = (enemy: TileEnemyIdentifer) => {
    addProjectileHit({ enemyId: enemy, projectile });
  };

  useProjectileMove(projectile);
  useProjectileCollision(key, enemies, addProjectileHitCallback);
  useDeleteSelfWhenOffscreen(projectile);

  return projectile;
};

export default useMinerProjectile;
