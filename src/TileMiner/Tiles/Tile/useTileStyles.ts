import tileGridToReal from 'helpers/tile-grid/gridToScreenCoords';
import { TILE_SIZE } from 'helpers/knobs';
import useBoxStyles from 'hooks/Entities/useBoxStyles';
import { GameCoords } from 'types/Game';

export interface Tile extends GameCoords {
  key: string,
  size?: number, // 1 by default
}

const useTileStyles = (tile: Tile) => {
  const boxSize = tile.size ?? 1;

  const { realX, realY } = tileGridToReal(tile.x, tile.y);

  const box = {
    size: boxSize * TILE_SIZE,
    x: realX,
    y: realY,
    key: `${tile.key}-${tile.x}-${tile.y}.box`,
  };

  return useBoxStyles(box);
};

export default useTileStyles;
