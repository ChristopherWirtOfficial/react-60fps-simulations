import React, { useState } from 'react';
import { useRecoilState, useRecoilCallback, useRecoilValue } from 'recoil';
import MousePositionAtom from '../atoms/MousePositionAtom';
import PlayerPositionAtom from '../atoms/Player/PlayerPositionAtom';
import useTick, { FRAMERATE } from '../hooks/useTick';
import EnemyAtomFamily, { Enemy } from '../atoms/Enemies/EnemyAtomFamily';
import EnemyIDListAtom from '../atoms/Enemies/EnemyIDListAtom';
import { makeStaticUseLog } from '../hooks/useLog';
import { ENEMY_DEATH_TIMEOUT } from '../knobs';
import useBoxStyles from '../hooks/Entities/useBoxStyles';
import useMovement, { enterOrbit, Moveable } from '../hooks/Entities/useMovement';
import { ScreenDimensionsSelector } from '../atoms/Screen/ScreenNodeAtom';

type MoveBoxTowardPointProps = {
  x: number;
  y: number;
  setX: (x: number) => void;
  setY: (y: number) => void;
  targetX: number;
  targetY: number;
  speed: number;
};

// BASE SPEED VALUE
const getTickSpeed = (pixelsPerSecond: number) => pixelsPerSecond / FRAMERATE;


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

// TODO: Try this out lol
const useLog = makeStaticUseLog('Deleting Self');


/*
  This is the component that renders an enemy

  @param { string } enemyKey - The key of the enemy to render
*/
const EnemyComp: React.FC<{ enemyKey: string }> = ({ enemyKey }) => {
  const { enemy } = useEnemyAtom(enemyKey);
  const {
    x,
    y,
    color,
    direction,
    size,
    key,
  } = enemy;

  // TODO: ROTATION/ANIMATION - Make this a selector off of the enemy's animation atom and the enemy's position atom
  // That was sort of a joke. I like the idea, but I mostly wanted to note that I should refactor it to use the new animation system

  const updateBox = useRecoilCallback(({ set }) => (newEnemy: Enemy) => {
    set(EnemyAtomFamily(enemy.key), newEnemy);
  });

  useMovement(enemy, [ enterOrbit ], updateBox);
  const boxStyles = useBoxStyles(enemy);


  return (
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
        { direction.toFixed(2) }
      </div>
    </div>
  );
};

export default EnemyComp;
