import { FC } from 'react';
import { RadialTile, ringInfo } from 'TileMiner/Enemies/atoms/RadialTiles';
import { drawArc } from './TileTest';

const Tile: FC<{ tile: RadialTile }> = ({ tile }) => {
  const { ring, index } = tile;
  const { radius: ringRadus, tileCount } = ringInfo(ring);

  const angleInDegrees = (index / tileCount) * 360;
  const pathProps = {
    transform: `rotate(${angleInDegrees})`,
    'transform-origin': 'left bottom',
  };

  const innerArcPath = drawArc(ring);
  // const innerArcPath = drawSteppedArc(ring);
  const innerArc = innerArcPath.toComponent(pathProps) as JSX.Element;

  return innerArc;
};

export default Tile;
