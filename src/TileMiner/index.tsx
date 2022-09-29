import React, { FC } from 'react';

import { Flex } from '@chakra-ui/react';
import useInitScreen from 'atoms/Screen/useScreen';
import TileGridEnemies from './Enemies/TileGridEnemies';
import TileMinerPlayerBox from './Player/TileMinerPlayer';
import { useTileMinerClickHandler } from './Player/useTileMinerPlayer';
import GunProjectiles from './Player/TilePlayerGun/GunProjectiles';


const TileMiner: FC = () => {
  // A ref to the screen element, which we'll attach to the container div ourselves.
  const { screenRef } = useInitScreen();

  // Probably need some kind of `useInit` for all of these that will
  //  build up as true singletones haha
  useTileMinerClickHandler();

  return (
    <Flex
      pos='fixed'
      ref={ screenRef }
      h='100vh'
      w='100vw'
      justifyContent='center'
      alignItems='center'
      bg='darkslategray'
    >
      <GunProjectiles />
      <TileGridEnemies />
      <TileMinerPlayerBox />
    </Flex>
  );
};

export default TileMiner;
