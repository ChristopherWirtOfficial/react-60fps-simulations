import { Flex } from '@chakra-ui/react';
import useInitScreen from 'atoms/Screen/useScreen';
import { CAMERA_POSITION_SCALING_FACTOR } from 'helpers/knobs';
import { FC } from 'react';

import TileEnemies from './Enemies/TileEnemies';
import CameraDebug from './Player/Camera/CameraDebug';
import useCamera from './Player/Camera/useCamera';
import TileMinerPlayerBox from './Player/TileMinerPlayer';
import TileMinerDebug from './Player/TilePlayerDebug';
import GunProjectiles from './Player/TilePlayerGun/GunProjectiles';
import { useTileMinerClickHandler } from './Player/useTileMinerPlayer';
import RadialEnemies from './RadialEnemies/RadialEnemies';
import TileTest from './RadialEnemies/TileTest';


const TileMiner: FC = () => {
  // A ref to the screen element, which we'll attach to the container div ourselves.
  const { screenRef } = useInitScreen();

  // Probably need some kind of `useInit` for all of these that will
  //  build up as true singletones haha
  useTileMinerClickHandler();

  const camera = useCamera();

  // How we actually move the canvas underneath the static viewport to make it look like we're moving the camera/player center
  // TODO: Make this depend on the zoom level as well
  const canvasOffset = {
    x: -camera.x * CAMERA_POSITION_SCALING_FACTOR,

    // NOTE: THis is BACKWARDS because the y axis is flipped in the canvas AND because we push in the oppsite direction of the camera
    // These cancel out and look like they're the not-backwards one
    y: camera.y * CAMERA_POSITION_SCALING_FACTOR,
  };

  return (
    <>
      <Flex
        pos='fixed'
        ref={ screenRef }
        h='100vh'
        w='100vw'
        justifyContent='center'
        alignItems='center'
        bg='darkslategray'
        transform={ `translate(${canvasOffset.x}px, ${canvasOffset.y}px)` }
      // Smooth scrolling, basically
        transition='transform 0.1s'
      >
        { /* <GunProjectiles /> */ }
        { /* <TileEnemies /> */ }
        <RadialEnemies />
        { /* <TileMinerPlayerBox /> */ }
        { /* <CameraDebug /> */ }
        { /* <TileTest /> */ }
      </Flex>
      { /* <TileMinerDebug /> */ }
    </>
  );
};

export default TileMiner;
