import { TILE_SIZE } from 'helpers/knobs';
import useBoxStyles from 'hooks/Entities/useBoxStyles';
import tileGridToReal from './helpers/gridToScreenCoords';
import { GridTile } from './helpers/gameCoordsToGridTile';

const useTileStyles = (tile: GridTile) => {
  const boxSize = tile.size ?? 1;

  const { realX, realY } = tileGridToReal(tile.gridX, tile.gridY);

  const box = {
    size: boxSize * TILE_SIZE,
    x: realX,
    y: realY,
    key: `${tile.key}-${tile.gridX}-${tile.gridY}.box`,
  };

  return useBoxStyles(box);
};

export default useTileStyles;
