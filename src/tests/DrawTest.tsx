import React from 'react';
import { createUseStyles } from 'react-jss';
import { useRecoilValue } from 'recoil';
import useScreen from '../atoms/Screen/useScreen';
import PlayerProjectiles from '../components/PlayerProjectiles';
import Enemies from '../components/Enemies';
import Player from '../components/Player';
import { ScreenDimensionsSelector } from '../atoms/Screen/ScreenNodeAtom';
import MousePositionAtom from '../atoms/MousePositionAtom';


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
  } = useScreen();
  const classes = useStyles();

  // TODO: Make the Player its own React component, duh

  // TODO move the player position to be a selector off of the actual pixel position value from a ref for the player
  //   and then place the player on the screen with normal HTML and css.

  const { width, height } = useRecoilValue(ScreenDimensionsSelector);


  const { x, y } = useRecoilValue(MousePositionAtom);

  // TODO: Read this about how I'm a genius lmao -
  //   Because of how I've set this up, it'll be fucking trivial to re-create the gamefield with a different interface, like SVG or something.


  return (
    <div ref={ screenRef } className={ classes.container }>
      <div>
        Center: { width / 2 } x { height / 2 }
      </div>
      <div>
        Mouse: { x } x { y }
      </div>
      <div style={ {
        position: 'absolute',
        top: height / 2,
        left: 0,
        width: '100%',
        height: '1px',
        backgroundColor: 'red',
      } }
      >{ ' ' }
      </div>
      <div style={ {
        // vertical line from center to top
        position: 'absolute',
        top: 0,
        left: width / 2,
        width: '1px',
        height: '100%',
        backgroundColor: 'blue',
      } }
      >{ ' ' }
      </div>


      <Player />
      <Enemies />
      <PlayerProjectiles />
    </div>
  );
};

export default DrawTest;
