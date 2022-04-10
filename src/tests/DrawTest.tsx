import React, { useEffect } from 'react';
import { createUseStyles } from 'react-jss';
import useTick from '@hooks/useTick';
import useProjectiles from '../atoms/Projectiles/useProjectiles';
import useScreen from '../atoms/Screen/useScreen';
import BasicBox from '../components/BasicBox';
import useEnemies from '../atoms/Enemies/useEnemies';
import usePlayer from '../atoms/Player/usePlayer';
import Projectile from '../components/Projectile';
import useLog from '../hooks/useLog';
import PlayerProjectiles from '../components/PlayerProjectiles';


const useStyles = createUseStyles({
  container: {
    position: 'relative',
    backgroundColor: 'palegoldenrod',
    width: '560px',
    height: '800px',
  },
});


const DrawTest: React.FC = () => {
  const {
    screenRef, // A ref to the screen element, which we'll attach to the container div ourselves.
    mouseX,
    mouseY,
  } = useScreen();
  const classes = useStyles();

  const enemies = useEnemies();
  const { playerRef } = usePlayer();

  // TODO: Move pretty much everything that's genuinely tick dependent out of this layer

  // TODO move the player position to be a selector off of the actual pixel position value from a ref for the player
  //   and then place the player on the screen with normal HTML and css.
  return (
    <div ref={ screenRef } className={ classes.container }>
      <div>
        Mouse X: { mouseX?.toFixed(2) }
        <br />
        Mouse Y: { mouseY?.toFixed(2) }
      </div>
      <div
        ref={ playerRef }
        style={ {
          position: 'absolute',
          top: '50%',
          left: '50%',
          height: '16px',
          width: '16px',
          margin: 'auto',
          // transform: 'translate(50%, 50%)',
          backgroundColor: 'blue',
        } }
      />
      {
        enemies.map(enemy => <BasicBox key={ enemy.key } enemy={ enemy } />)
      }

      <PlayerProjectiles />
    </div>
  );
};

export default DrawTest;
