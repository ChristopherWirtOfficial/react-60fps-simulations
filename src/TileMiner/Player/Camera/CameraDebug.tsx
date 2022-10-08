import { Box } from '@chakra-ui/react';
import { ScreenDimensionsSelector } from 'atoms/Screen/ScreenNodeAtom';
import useBoxStyles from 'hooks/Entities/useBoxStyles';
import { useAtomValue } from 'jotai';
import { FC } from 'react';
import { Box as BoxType } from 'types/Boxes';

const CameraDebug: FC = () => {
  const screenDimensions = useAtomValue(ScreenDimensionsSelector);

  const fakeBox: BoxType = {
    key: 'fakeBox',
    x: screenDimensions.viewport.x,
    y: screenDimensions.viewport.y,
    size: screenDimensions.viewport.height,
    color: 'red',
  };

  const styles = useBoxStyles(fakeBox);

  return (
    <Box { ...styles } border='25px solid red'>

    </Box>
  );
};

export default CameraDebug;
