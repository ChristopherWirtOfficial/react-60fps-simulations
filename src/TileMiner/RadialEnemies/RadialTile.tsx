import { FC } from 'react';
import { RadialTile, ringInfo } from 'TileMiner/Enemies/atoms/radialTiles';
import drawTile from './RadialTile/drawTile';

const Tile: FC<{ tile: RadialTile }> = ({ tile }) => {
  const { ring, index } = tile;
  const { tileCount } = ringInfo(ring);

  const angleInDegrees = 360 - (index / tileCount) * 360;
  const pathProps = {
    transform: `rotate(${angleInDegrees})`,
  };

  const tileShape = drawTile(tile).toComponent(pathProps) as JSX.Element;


  // TODO: PICKUP - I'm trying to debug how to get the tiles to go in the right direction
  return index !== 1 ? tileShape : null;
};

export default Tile;
