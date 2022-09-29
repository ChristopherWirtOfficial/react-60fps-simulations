import FPSCounter from 'components/FPSCounter';
import { SHOW_AXIS, SHOW_FPS } from 'helpers/knobs';
import { useAtomValue } from 'jotai';
import React, { FC } from 'react';
import { createUseStyles } from 'react-jss';

import MousePositionAtom from '../atoms/MousePositionAtom';
import { ScreenDimensionsSelector } from '../atoms/Screen/ScreenNodeAtom';
import useScreen from '../atoms/Screen/useScreen';
import Enemies from '../components/Enemies';
import Player from '../components/Player';
import PlayerProjectiles from '../components/PlayerProjectiles';


const useStyles = createUseStyles({
  container: {
    position: 'relative',
    backgroundColor: 'palegoldenrod',
    width: '560px',
    height: '800px',
  },
});

const DrawTest: FC = () => {
  const {
    screenRef, // A ref to the screen element, which we'll attach to the container div ourselves.
  } = useScreen();
  const classes = useStyles();


  // TODO move the player position to be a selector off of the actual pixel position value from a ref for the player
  //   and then place the player on the screen with normal HTML and css.
  // ^ I think that's done lol
  const { width, height } = useAtomValue(ScreenDimensionsSelector);


  const { x, y } = useAtomValue(MousePositionAtom);

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
      {
        SHOW_FPS && (
          <FPSCounter />
        )
      }
      {
        SHOW_AXIS && (
          <>
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
          </>
        )
      }

      <Player />
      <Enemies />
      <PlayerProjectiles />
    </div>
  );
};

export default DrawTest;
