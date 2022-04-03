import { atomFamily, selectorFamily } from 'recoil';
import { ScreenDimensionsSelector } from '../Screen/ScreenNodeAtom';

export type Enemy = {
  key: string;

  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  health: number;
  maxHealth: number;
  damage: number;
  color: string;
};

export default atomFamily<Enemy, string>({
  key: 'Enemy',

  default: selectorFamily({
    key: 'EnemyDefaultSelector',
    get: key => ({ get }) => {
      const size = Math.floor(Math.random() * 35) + 15;

      const { width: screenWidth, height: screenHeight } = get(ScreenDimensionsSelector);
      const secondaryDimensionOffset = 2 * size;
      const whichSides = Math.floor(Math.random() * 2 - 1);
      const spawnType = Math.random() * 2 > 1 ? 'random-x' : 'random-y';

      const mainDimensionPosition = (spawnType === 'random-x' ? screenWidth : screenHeight) * Math.random();
      const secondaryDimensionPosition = whichSides >= 0 ?
        -secondaryDimensionOffset :
        secondaryDimensionOffset + (spawnType === 'random-x' ? screenHeight : screenWidth);

      const startingX = spawnType === 'random-x' ? mainDimensionPosition : secondaryDimensionPosition;
      const startingY = spawnType === 'random-y' ? mainDimensionPosition : secondaryDimensionPosition;


      const newEnemy: Enemy = {
        key,

        // Should be just off screen in any of the 4 directions, and as close to or far from corners as we want
        x: startingX,
        y: startingY,
        width: size,
        height: size,
        speed: 250,
        health: 100,
        maxHealth: 100,
        damage: 10,
        color: 'red',
      };

      return newEnemy;
    },
  }),
});

