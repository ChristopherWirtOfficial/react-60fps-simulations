import { FC, useCallback } from 'react';
import { Box } from '@chakra-ui/react';

import { atom, useAtom } from 'jotai';
import useTileStyles from '../Tile/useTileStyles';

export const STORE_LOCATION = { gridX: -1, gridY: 1 };

// The base currency from mining tiles
export const MaterialEssenceAtom = atom(0);

export const useMaterialEssence = () => {
  const [ materialEssence, setMaterialEssence ] = useAtom(MaterialEssenceAtom);

  const addMaterialEssence = useCallback((amount: number) => {
    setMaterialEssence(prev => prev + amount);
  }, [ setMaterialEssence ]);

  const removeMaterialEssence = useCallback((amount: number) => {
    setMaterialEssence(prev => prev - amount);
  }, [ setMaterialEssence ]);

  return { materialEssence, addMaterialEssence, removeMaterialEssence };
};

const StoreTile: FC = () => {
  const storeTileStyles = useTileStyles({
    size: 1,
    key: 'Store',
    ...STORE_LOCATION,
  });

  return (
    <Box bg='red' { ...storeTileStyles }>
      The store!
    </Box>
  );
};

export default StoreTile;
