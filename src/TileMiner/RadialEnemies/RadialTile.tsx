import { FC } from 'react';
import { RadialTile, ringInfo } from 'TileMiner/Enemies/atoms/radialTiles';
import drawTile from './RadialTile/drawTile';

const Tile: FC<{ tile: RadialTile }> = ({ tile }) => {
  const { ring, index } = tile;
  const { tileCount } = ringInfo(ring);

  const angleInDegrees = (index / tileCount) * 360;
  const pathProps = {
    transform: `rotate(${angleInDegrees})`,
    'transform-origin': 'left bottom',
  };

  const tileShape = drawTile(tile).toComponent(pathProps) as JSX.Element;

  return tileShape;
};

export default Tile;
