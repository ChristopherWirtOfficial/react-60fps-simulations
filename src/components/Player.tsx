import React, { FC } from 'react';
import usePlayer from '../atoms/Player/usePlayer';
import useBoxStyles from '../hooks/Entities/useBoxStyles';

const Player: FC = () => {
  const { playerPosition } = usePlayer();

  const playerCenterBoxStyles = useBoxStyles(playerPosition);

  return (
    <div
      style={ {
        ...playerCenterBoxStyles,
        backgroundColor: 'blue',
      } }
    />
  );
};

export default Player;
