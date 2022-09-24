import React, { FC } from 'react';

import { Box, Flex } from '@chakra-ui/react';
import useInitScreen from 'atoms/Screen/useScreen';
import { useAtomValue } from 'jotai';
import useBoxStyles from 'hooks/Entities/useBoxStyles';
import TileGridEnemies from './Enemies/TileGridEnemies';
import TileMinerPlayerBox from './Player/TileMinerPlayer';
import { useTileMinerClickHandler } from './Player/useTileMinerPlayer';
import { GunTipPositionSelector } from './Player/TilePlayerGun/useGun';

const TrackGunTip: FC = () => {
  const gunTipPos = useAtomValue(GunTipPositionSelector);

  const styles = useBoxStyles({
    key: 'gunTip',
    x: gunTipPos?.x ?? 0,
    y: gunTipPos?.y ?? 0,
    size: 10,
    color: 'white',
  });

  return (
    <Box { ...styles } bg='lime' fontWeight='bold' />
  );
};

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
      <TileGridEnemies />
      <TileMinerPlayerBox />
      <TrackGunTip />
    </Flex>
  );
};

export default TileMiner;
