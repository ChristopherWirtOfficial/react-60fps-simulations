import { Box } from '@chakra-ui/react';
import useProjectileKeys from 'atoms/Projectiles/useProjectileKeys';
import { ScreenDimensionsSelector } from 'atoms/Screen/ScreenNodeAtom';
import FPSCounter from 'components/FPSCounter';
import useBoxStyles from 'hooks/Entities/useBoxStyles';
import { getTickFunctors } from 'hooks/useTick';
import { useAtomValue } from 'jotai';
import React, { FC, useMemo } from 'react';
import { TileGridEnemyIDList, TileGridOnscreenEnemyIDList } from 'TileMiner/Enemies/atoms/TileGridEnemyAtoms';
import { Box as BoxType } from 'types/Boxes';
import { LastMouseClickAtom, LastMouseClickSelector, PlayerSelector } from './PlayerAtoms';
import { GunTipPositionSelector, GunTipScreenPositionAtom } from './TilePlayerGun/useGun';


const TileMinerDebug: FC = () => {
  const player = useAtomValue(PlayerSelector);
  const lastMouseClickScreenPosition = useAtomValue(LastMouseClickAtom);
  const lastMouseClick = useAtomValue(LastMouseClickSelector);
  const gunTipPos = useAtomValue(GunTipPositionSelector);
  const gunTipScreenPos = useAtomValue(GunTipScreenPositionAtom);
  const { center } = useAtomValue(ScreenDimensionsSelector);
  const { projectileKeys } = useProjectileKeys();
  const enemyKeys = useAtomValue(TileGridEnemyIDList);
  const onscreenEnemyKeys = useAtomValue(TileGridOnscreenEnemyIDList);

  const fakeMouseClickBox: BoxType = useMemo(() => ({
    key: 'fakeMouseClickBox',
    x: lastMouseClick?.x ?? 152315,
    y: lastMouseClick?.y ?? 125235,
    size: 10,
    color: 'white',
  }), [ lastMouseClick ]);

  const styles = useBoxStyles(fakeMouseClickBox);

  // TODO: Make a generic debug component that can be used for any metric, and make it toggleable from a list or something
  // Persist the debug state in local storage

  return (
    <>
      <Box
        pos='fixed'
        fontFamily='consolas'
        top='0'
        left='0'
        color='white'
        fontWeight='bold'
        bg='black'
        p={ 6 }
      >
        <FPSCounter />

        { /* <Box>Firing Direction: { player.firingDirection?.toFixed(3) }rad</Box> */ }
        { /* <Box>Gun Tip Position: { gunTipPos?.x.toFixed(2) }, { gunTipPos?.y.toFixed(2) }</Box> */ }
        { /* <Box>Gun Tip Screen Position: { gunTipScreenPos?.x.toFixed(2) }, { gunTipScreenPos?.y.toFixed(2) }</Box> */ }
        { /* <Box>Last Mouse Click (Screen):
          <Box as='span' color='gold'>
            { lastMouseClickScreenPosition?.x.toFixed(2) }, { lastMouseClickScreenPosition?.y.toFixed(2) }
          </Box>
        </Box> */ }
        { /* <Box>Last Mouse Click:
          <Box as='span' color='yellow'>{ lastMouseClick?.x.toFixed(2) }, { lastMouseClick?.y.toFixed(2) }</Box>
        </Box> */ }
        { /* <Box>Center: { center?.x.toFixed(2) }, { center?.y.toFixed(2) }</Box> */ }
        <Box>Registered Functors: { getTickFunctors().length }</Box>
        <Box>Projectiles: { projectileKeys.length } </Box>
        <Box>Enemies: { enemyKeys.length } </Box>
        <Box>Onscreen Enemies: { onscreenEnemyKeys.length } </Box>
      </Box>
      <Box { ...styles } bg='white' fontWeight='bold' />
    </>
  );
};

export default TileMinerDebug;
