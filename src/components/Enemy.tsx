import React from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { useAtomCallback } from 'jotai/utils';
import { SHOW_ENEMY_ANGLE, SHOW_ENEMY_INSERTION_POINT } from 'helpers/knobs';
import { Enemy } from 'types/Boxes';
import projectCollision from 'helpers/collisions/projectCollisions';
import useTick from 'hooks/useTick';
import { ProjectileListSelector } from 'atoms/Projectiles/ProjectileAtomFamily';
import EnemyAtomFamily from '../atoms/Enemies/EnemyAtomFamily';
import EnemyIDListAtom from '../atoms/Enemies/EnemyIDListAtom';
import useBoxStyles from '../hooks/Entities/useBoxStyles';
import useMovement from '../hooks/Entities/useMovement';
import ClosestEnemySelector from '../atoms/Enemies/ClosestEnemySelector';


const useEnemyAtom = (key: string) => {
  const enemy = useAtomValue(EnemyAtomFamily(key));

  const deleteSelf = useAtomCallback((get, set) => {
    set(EnemyIDListAtom, oldEnemyIDList => oldEnemyIDList.filter(k => k !== enemy.key));
  });

  return {
    enemy,
    deleteSelf,
  };
};

const useProjTargetingUs = (enemy: Enemy) => {
  const { key } = enemy;
  const projectiles = useAtomValue(ProjectileListSelector);

  return projectiles.find(p => p.target.key === key);
};

const useJumpToCollision = (enemy: Enemy) => {
  const { key } = enemy;
  const setEnemy = useSetAtom(EnemyAtomFamily(key));

  const projectileTargetingUs = useProjTargetingUs(enemy);

  useTick(() => {
    if (projectileTargetingUs) {
      const collisionPoint = projectCollision(enemy, [ projectileTargetingUs ]);
      if (collisionPoint) {
        setEnemy(e => ({ ...e, x: collisionPoint.x, y: collisionPoint.y }));
      }
    }
  });
};

/*
  This is the component that renders an enemy

  @param { string } enemyKey - The key of the enemy to render
*/
const EnemyComp: React.FC<{ enemyKey: string }> = ({ enemyKey }) => {
  const { enemy } = useEnemyAtom(enemyKey);
  const {
    color,
    direction,
    insertionPointX,
    insertionPointY,
  } = enemy;

  const enemyAtom = EnemyAtomFamily(enemyKey);
  useMovement(enemyAtom);
  useJumpToCollision(enemy);


  const boxStyles = useBoxStyles(enemy);


  const insertionStyle = useBoxStyles({
    // Just some fake bullshit anyway
    // @ts-expect-error
    x: insertionPointX, y: insertionPointY, size: 10, color, direction,
  });

  const showInsertionPoint = SHOW_ENEMY_INSERTION_POINT;
  const showDirection = SHOW_ENEMY_ANGLE;

  const closestEnemy = useAtomValue(ClosestEnemySelector);
  const lookAtMe = closestEnemy?.key === enemy.key; // I am the closest now

  return (
    <>
      {
        showInsertionPoint && (
          <div style={ {
            ...insertionStyle,
            backgroundColor: color,
          } }
          />
        )
      }
      <div
        style={ {
          ...boxStyles,
          transform: `${boxStyles.transform} rotate(${direction}rad)`,
          border: `2px solid ${color}`,
          borderRadius: '1px',
          background: lookAtMe ? '#ff0000' : color,
        } }
      >
        { ' ' }
        <div
          style={ {
            position: 'absolute',
            color,
            transform: `translate(0, -30px) rotate(${-direction}rad)`,
          } }
        >
          {
          // Anything in this div will be put above the enemy's head, right side up. Great for debugging!
          }
          { showDirection && (direction).toFixed(2) }
        </div>
      </div>
    </>
  );
};

export default EnemyComp;
