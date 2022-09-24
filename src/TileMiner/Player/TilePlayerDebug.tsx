import { Box } from '@chakra-ui/react';
import useBoxStyles from 'hooks/Entities/useBoxStyles';
import { useAtomValue } from 'jotai';
import React, { FC, useMemo } from 'react';
import { Box as BoxType } from 'types/Boxes';
import { LastMouseClickSelector, PlayerSelector } from './PlayerAtoms';


const TileMinerDebug: FC = () => {
  const player = useAtomValue(PlayerSelector);
  const lastMouseClick = useAtomValue(LastMouseClickSelector);

  const fakeMouseClickBox: BoxType = useMemo(() => ({
    key: 'fakeMouseClickBox',
    x: lastMouseClick?.x ?? 152315,
    y: lastMouseClick?.y ?? 125235,
    size: 10,
    color: 'white',
  }), [ lastMouseClick ]);

  const styles = useBoxStyles(fakeMouseClickBox);

  return (
    <>
      <Box pos='fixed' fontFamily='consolas' top='0' left='0' color='white' fontWeight='bold'>
        <Box>Player</Box>
        <Box>Position: { player.x }, { player.y }</Box>
        <Box>Firing Direction: { player.firingDirection?.toFixed(3) }rad</Box>
      </Box>
      <Box { ...styles } bg='white' fontWeight='bold' />
    </>
  );
};

export default TileMinerDebug;
