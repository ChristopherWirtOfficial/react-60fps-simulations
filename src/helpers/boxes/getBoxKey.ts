import { Box, BoxTypeOrKey } from 'types/Boxes';

const getBoxKey = <BoxType extends Box>(boxOrKey: BoxTypeOrKey<BoxType>) => {
  if (typeof boxOrKey === 'string') {
    return boxOrKey;
  }
  return boxOrKey.key;
};

export default getBoxKey;
