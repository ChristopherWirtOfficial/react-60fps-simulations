import useMouse from '@react-hook/mouse-position';
import React, { useState, useEffect } from 'react';
import { createUseStyles } from 'react-jss';
import useTick, { FRAMERATE } from '../hooks/useTick';

// I should do stuff like boss intro animations.
// Bosses could appear, which stops all other spawns before the boss shows up
// Then when the boss finally does show up, it steps through a couple of key animations that look cool
//  like the boss is coming out of a hole in the ground (a suggestion by VS Code lol)
//  or like the boss does something as simple as comes into the screen, spins a little,
//    settles into place and then grows in size in a flurish
//  It should be really easy to animate that with just keyframes and the tick system. Probably create a whole
//  abstraction around it? Maybe an animation system that takes in a bunch of keyframes and then renders them in order,
// as the animation expires

/* eslint-disable max-len */
/*

    Box types
    1. Fodder
    2. Knight level
        - Lots of these guys, stronger fodder with some level of special abilities like
            - Shield
            - Stops at a certain distance and range attacks
            - Stops at a certain distance and then dashes toward the center
                The animation for this should look like coming to a stop, then rearing back, then lunging
                I wonder how much Github Copilot can help with this lol
            - Just more health/more melee damage
    3. Mini-boss
        - Plenty of these, but not common. Pretty strong and should be very cool.
        - I like the idea that these ones are individuals. Like, 5-10 different mini-boss levels (better name needed)
           and they have various traits and maybe stories..? which make them characters that the player sort of recognizes
    4. Boss
        - Idk man, should be the coolest enemies and hardest, maybe even to a point where you wipe the first few times
            you get to it, much like a roguelike. (Since it's supposed to feel sort of like it)


    MOUSE
    I want to use the mouse position for something
    At the end of the day, this is still an idle. But it would be cool to have some kind of extra weapon that
      either shoots out in the direction of the mouse (or in a default direction if you're not holding the mouse?)

    Or an AI controlled player-unit that moves toward the mouse and attacks nearby enemies? And he'll follow the mouse
        around the screen to attack things in certain areas?
*/
/* eslint-enable max-len */


const useStyles = createUseStyles({
  container: {
    position: 'relative',
    backgroundColor: 'palegoldenrod',
    width: '100%',
    height: '100%',
  },
  box: {
  },
});

const [ centerX, centerY ] = [ 250, 100 ];

const DrawTest: React.FC = () => {
  // Ref for the canvas element
  const ref = React.useRef<HTMLDivElement>(null);

  const { x: mouseX, y: mouseY } = useMouse(ref);

  const [ x, setX ] = useState(10);
  const [ y, setY ] = useState(10);

  useTick(() => {
    // Number of pixels to move per frame
    const PIXELS_PER_SECOND = 500;
    const PIXELS_PER_FRAME = PIXELS_PER_SECOND / FRAMERATE;

    // Move the box towards the center of the screen by SPEED pixels every frame
    const moveBoxTowardCenter = () => {
      const targetX = mouseX || centerX;
      const targetY = mouseY || centerY;
      const angleTowardCenter = Math.atan2(targetY - y, targetX - x);
      const distanceToCenter = Math.sqrt((targetY - y) ** 2 + (targetX - x) ** 2);

      const pixelsToMove = PIXELS_PER_FRAME;
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
    moveBoxTowardCenter();
  }, 1);

  const classes = useStyles();


  return (
    <div ref={ ref } className={ classes.container }>
      <div>
        X: { x.toFixed(2) }
        <br />
        Y: { y.toFixed(2) }
      </div>
      <div>
        Mouse X: { mouseX?.toFixed(2) }
        <br />
        Mouse Y: { mouseY?.toFixed(2) }
      </div>
      <div
        className={ classes.box }
        style={ {
          position: 'absolute',
          top: '-12px',
          left: '-12px',
          transform: `translate(${x}px, ${y}px)`,

          width: '24px',
          height: '24px',
          border: '2px solid red',
          borderRadius: '1px',
        } }
      >
        { ' ' }
      </div>
      <div style={ {
        position: 'absolute',
        top: '-8px', // Exactly half of the box height
        left: '-8px',
        transform: `translate(${centerX}px, ${centerY}px)`,
        height: '16px',
        width: '16px',
        backgroundColor: 'blue',
      } }
      />
      <div />
    </div>
  );
};

export default DrawTest;
