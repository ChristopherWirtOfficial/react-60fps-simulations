import React from 'react';
import { createUseStyles } from 'react-jss';
import { useProjectileKeyList as useProjectiles } from '../atoms/Projectiles/ProjectileAtomFamily';
import useScreen from '../atoms/Screen/useScreen';
import BasicBox from '../components/BasicBox';
import useEnemies from '../atoms/Enemies/useEnemies';
import usePlayer from '../atoms/Player/usePlayer';
import Projectile from '../components/Projectile';


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
  const { projectiles } = useProjectiles();

  const { playerRef } = usePlayer();

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
      {
        projectiles.map(projectile => <Projectile key={ projectile.key } projectile={ projectile } />)
      }
    </div>
  );
};

export default DrawTest;
