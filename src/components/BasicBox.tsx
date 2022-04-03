import React, { useState } from 'react';
import { useRecoilState, useRecoilCallback } from 'recoil';
import MousePositionAtom from '../atoms/MousePositionAtom';
import PlayerPositionAtom from '../atoms/Player/PlayerPositionAtom';
import useTick, { FRAMERATE } from '../hooks/useTick';
import EnemyAtomFamily, { Enemy } from '../atoms/Enemies/EnemyAtomFamily';
import EnemyIDListAtom from '../atoms/Enemies/EnemyIDListAtom';
import { useProjectileKeyList } from '../atoms/Projectiles/ProjectileAtomFamily';

type MoveBoxTowardPointProps = {
  x: number;
  y: number;
  setX: (x: number) => void;
  setY: (y: number) => void;
  targetX: number;
  targetY: number;
  speed: number;
};

const moveBoxTowardPoint = ({
  x, y, setX, setY, targetX, targetY, speed,
}: MoveBoxTowardPointProps) => {
  const angleTowardCenter = Math.atan2(targetY - y, targetX - x);

  const pixelsToMove = speed;
  const newX = x + pixelsToMove * Math.cos(angleTowardCenter);
  const newY = y + pixelsToMove * Math.sin(angleTowardCenter);

  // Gonna need to avoid letting the box get too close to the thing it's moving towards
  // I should ease off the speed as it approaches the target
  // Basically, if it's less than a certain amount of distane away, slow down exponentially
  const slowDownDistance = 50;
  const slowDownFactor = 0.7;
  const slowDownDistanceSquared = slowDownDistance ** 2;
  const distanceSquared = (newX - targetX) ** 2 + (newY - targetY) ** 2;

  const slowDownFactorMultiplier = 1 - (distanceSquared / slowDownDistanceSquared);
  const slowDownFactorMultiplierClamped = Math.max(0, Math.min(1, slowDownFactorMultiplier));

  const slowDownFactorMultiplierAdjusted = slowDownFactor * slowDownFactorMultiplierClamped;

  const newXAdjusted = newX - (pixelsToMove * Math.cos(angleTowardCenter) * slowDownFactorMultiplierAdjusted);
  const newYAdjusted = newY - (pixelsToMove * Math.sin(angleTowardCenter) * slowDownFactorMultiplierAdjusted);

  const xDistanceToTarget = Math.abs(x - targetX);
  const yDistanceToTarget = Math.abs(y - targetY);
  if (xDistanceToTarget > 1.5) {
    setX(newXAdjusted);
  }
  if (yDistanceToTarget > 1.5) {
    setY(newYAdjusted);
  }
};


// BASE SPEED VALUE
const getTickSpeed = (pixelsPerSecond: number) => pixelsPerSecond / FRAMERATE;


type BasicBoxProps = {
  enemy: Enemy
};

const BasicBox: React.FC<BasicBoxProps> = ({ enemy }) => {
  const {
    x,
    y,
    speed,
    width,
    height,
  } = enemy;

  const [ , setEnemyAtom ] = useRecoilState(EnemyAtomFamily(enemy.key));
  const setX = (val: number) => setEnemyAtom(e => ({ ...e, x: val }));
  const setY = (val: number) => setEnemyAtom(e => ({ ...e, y: val }));

  const [ { x: mouseX, y: mouseY } ] = useRecoilState(MousePositionAtom);
  const [ { x: playerX, y: playerY } ] = useRecoilState(PlayerPositionAtom);

  useTick(() => {
    moveBoxTowardPoint({
      x,
      y,
      setX,
      setY,
      targetX: playerX ?? mouseX,
      targetY: playerY ?? mouseY,
      speed: getTickSpeed(speed),
    });
  });

  const { addProjectile } = useProjectileKeyList();

  // Attacks!
  useTick(() => {
    addProjectile();
  }, 10);

  // TODO: Remove this probably lol
  // Or at least only make it happen if we actually track that a box dies from inside the box. Not a bad idea
  const deleteSelf = useRecoilCallback(({ set }) => () => {
    set(EnemyIDListAtom, oldEnemyIDList => oldEnemyIDList.filter(key => key !== enemy.key));
  });
  const [ tickCount, setTickCount ] = useState(0);
  useTick(() => {
    setTickCount(oldTickCount => oldTickCount + 1);
    if (tickCount >= 250) {
      setTickCount(0);
      deleteSelf();

      console.log('BasicBox Deleting self!', {
        x,
        y,
        playerX,
        playerY,
        adjustedX: x - (width / 2),
        adjustedY: y - (height / 2),
        halfWidth: width / 2,
        halfHeight: height / 2,
      });
    }
  });

  // RANDOM NOTE:
  // Things that are falling toward the box should look like it, and angle down toward the center
  // But how do you do that in a way that still lets you animate the center?
  //  Probably create an abstraction for the angle of the box that is relative to the 0 angle where the box is falling toward the center
  //    that way we can still animate it, but the default state is falling toward the center... This means that animations are going to use 100% javascript, in all liklihood
  // ... Will this cause performance problems? Let's do it and only optimize/refactor if it does

  // TODO: The fact that I can see the rotation angle change as it appraoches the "center" proves that things are wrong in my transforms
  //  that should be the best litnis test for when I've got both the player and the BasicBox transforms working perfectly
  const rotationDeg = ((Math.atan2((mouseY ?? playerY) - y, (mouseX ?? playerX) - x) * 180) / Math.PI).toFixed(1);

  return (
    <div
      style={ {
        position: 'absolute',
        // eslint-disable-next-line max-len
        transform: `translate(${x}px, ${y - height}px) rotate(${rotationDeg}deg)`,

        width: `${width}px`,
        height: `${height}px`,
        border: '2px solid red',
        borderRadius: '1px',
      } }
    >
      { ' ' }
    </div>
  );
};

export default BasicBox;
