import { useDeleteSelfWhenOffscreen, useProjectileMove } from 'atoms/Projectiles/useProjectile';
import useProjectileAtom from 'atoms/Projectiles/useProjectileAtom';
import getBoxKey from 'helpers/boxes/getBoxKey';
import checkCollisions from 'helpers/collisions/checkCollisions';
import useTick from 'hooks/useTick';
import { useAtomValue } from 'jotai';
import { RESET, useAtomCallback } from 'jotai/utils';
import ProjectileTileGridEnemySelectorFamily from 'TileMiner/Enemies/atoms/ProjectileTileGridEnemySelectorFamily';
import {
  calculateDamage,
  TileEnemy,
  TileGridEnemyAtomFamily,
  TileGridEnemyIDList,
} from 'TileMiner/Enemies/atoms/TileGridEnemyAtoms';
import { BoxTypeOrKey, Moveable, Projectile } from 'types/Boxes';

type ExecuteDamageStepArgs<MoveableType extends Moveable> = { enemy: MoveableType, damage: number };
type ExecuteDamageStepType<MoveableType extends Moveable> = (args: ExecuteDamageStepArgs<MoveableType>) => void;

const useProjectileCollision = <MoveableType extends Moveable>
  (key: string, enemies: MoveableType[], executeDamageStep: ExecuteDamageStepType<MoveableType>) => {
  const { projectile, removeProjectile } = useProjectileAtom(key);

  const checkEnemyCollisions = () => {
    const collidedEnemy = checkCollisions(projectile, enemies) as MoveableType;
    if (collidedEnemy) {
      executeDamageStep({ enemy: collidedEnemy, damage: projectile.damage });

      // Remove ourselves, duh
      removeProjectile(key);
    }
  };

  useTick(checkEnemyCollisions);
};


const useMinerProjectile = (projectileOrKey: BoxTypeOrKey<Projectile>) => {
  const key = getBoxKey(projectileOrKey);

  const { projectile } = useProjectileAtom(key);

  // Gets only the enemies that are in the same neighborhood as the projectile to check for collisions
  const enemies = useAtomValue(ProjectileTileGridEnemySelectorFamily(key));
  // console.log('Enemies near me', enemies.length);

  const executeDamageStep = useAtomCallback((get, set, { enemy, damage }: ExecuteDamageStepArgs<TileEnemy>) => {
    const { gridX, gridY } = enemy;
    const enemyAtom = TileGridEnemyAtomFamily({ key: enemy.key, gridX, gridY });
    const enemyAtomValue = get(enemyAtom);

    const newEnemy = calculateDamage(enemyAtomValue, damage);
    set(enemyAtom, newEnemy);

    const lookie = get(enemyAtom);

    // TODO: Move this, and everything else, to WriteAtoms and pass the useSetAtom() res, or a composition, as executeDamageStep
    if (lookie.health <= 0) {
      set(enemyAtom, RESET);
      set(TileGridEnemyIDList, ids => ids.filter(id => id.key !== enemy.key));
    }
  });

  useProjectileMove(projectile);
  useProjectileCollision(key, enemies, executeDamageStep);
  useDeleteSelfWhenOffscreen(projectile);

  return projectile;
};

export default useMinerProjectile;
