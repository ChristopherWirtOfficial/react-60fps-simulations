import React from 'react';
import { useRecoilState, useRecoilCallback } from 'recoil';
import EnemyAtomFamily, { Enemy } from '../atoms/Enemies/EnemyAtomFamily';
import EnemyIDListAtom from '../atoms/Enemies/EnemyIDListAtom';
import { SHOW_ENEMY_ANGLE, SHOW_ENEMY_INSERTION_POINT } from '../knobs';
import useBoxStyles from '../hooks/Entities/useBoxStyles';
import useMovement, { enterOrbit } from '../hooks/Entities/useMovement';


const useEnemyAtom = (key: string) => {
  const [ enemy ] = useRecoilState(EnemyAtomFamily(key));

  const deleteSelf = useRecoilCallback(({ set }) => () => {
    set(EnemyIDListAtom, oldEnemyIDList => oldEnemyIDList.filter(k => k !== enemy.key));
  });

  return {
    enemy,
    deleteSelf,
  };
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

  const updateBox = useRecoilCallback(({ set }) => (newEnemy: Enemy) => {
    set(EnemyAtomFamily(enemy.key), newEnemy);
  });

  useMovement(enemy, [ enterOrbit ], updateBox);
  const boxStyles = useBoxStyles(enemy);


  const insertionStyle = useBoxStyles({
    // @ts-expect-error
    x: insertionPointX, y: insertionPointY, size: 10, color, direction,
  });

  const showInsertionPoint = SHOW_ENEMY_INSERTION_POINT;
  const showDirection = SHOW_ENEMY_ANGLE;


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
