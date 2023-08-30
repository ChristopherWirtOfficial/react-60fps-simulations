import { FC, useCallback } from 'react';
import { Box, Button, Flex, HStack, Text } from '@chakra-ui/react';

import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  BenchedDudes,
  TotalDudesAvailable,
} from 'TileMiner/Enemies/Dudes/TileEnemyDudesAtoms';
import { DUDE_SIZE } from 'TileMiner/Enemies/Dudes/TileEnemyDudes';
import useTileStyles from '../Tile/useTileStyles';

export const STORE_LOCATION = { gridX: 0, gridY: -1 };

// The base currency from mining tiles
export const MaterialEssenceAtom = atom(0);

export const useMaterialEssence = () => {
  const [materialEssence, setMaterialEssence] = useAtom(MaterialEssenceAtom);

  const addMaterialEssence = useCallback(
    (amount: number) => {
      setMaterialEssence(prev => prev + amount);
    },
    [setMaterialEssence]
  );

  const removeMaterialEssence = useCallback(
    (amount: number) => {
      setMaterialEssence(prev => prev - amount);
    },
    [setMaterialEssence]
  );

  return { materialEssence, addMaterialEssence, removeMaterialEssence };
};

export const CurrentDudePrice = atom(get => {
  const dudes = get(TotalDudesAvailable);

  const purchasedDudes = dudes - 1; // You start with one dude

  const price = Math.floor(10 * 2.1 ** purchasedDudes);

  return price;
});

const useBuyDudes = () => {
  const { materialEssence, removeMaterialEssence } = useMaterialEssence();

  const [totalDudes, setTotalDudesAvailable] = useAtom(TotalDudesAvailable);
  const setBenchedDudes = useSetAtom(BenchedDudes);

  const currentPrice = useAtomValue(CurrentDudePrice);

  const buyDude = useCallback(() => {
    removeMaterialEssence(1);

    // TODO: Do this more transactionally and not in a random file tbh lol
    // Increment both the total dudes available and the benched dudes
    // (the total dudes available is the purchase ledger basically, and for now
    //  the benched dudes is actually making that dude available to the game logic)
    setTotalDudesAvailable(prev => prev + 1);
    setBenchedDudes(prev => prev + 1);
  }, [removeMaterialEssence, setTotalDudesAvailable, setBenchedDudes]);

  return { materialEssence, buyDude, currentPrice, totalDudes };
};

const StoreTile: FC = () => {
  const { materialEssence, buyDude, currentPrice, totalDudes } = useBuyDudes();

  const storeTileStyles = useTileStyles({
    size: 1,
    key: 'Store',
    ...STORE_LOCATION,
  });

  const canBuyDude = materialEssence >= currentPrice;

  return (
    <Box
      bg='slategray'
      border='1px solid white'
      {...storeTileStyles}
      fontSize='xs'
    >
      <Flex flexDir='column' py='0.25rem' w='100%' gap={2}>
        <Text fontWeight='semibold' textAlign='center'>
          Upgrades
        </Text>
        <Flex
          px={2}
          alignItems='center'
          justifyContent='space-between'
          w='100%'
          gap={2}
        >
          <Box fontWeight='bold' fontSize='0.9rem' flex={1} textAlign='right'>
            <HStack justifyContent='end'>
              <DudeChip />
              <Text>{totalDudes}</Text>
            </HStack>
          </Box>
          <Button
            // as={ Box }
            px='0rem'
            py='.1rem'
            bg='black'
            fontSize='1em'
            h='1rem'
            color='whitesmoke'
            onClick={canBuyDude ? buyDude : undefined}
            disabled={!canBuyDude}
            _disabled={{
              filter: 'brightness(0.4)',
              color: 'red.300',
            }}
            _active={{ _disabled: {} }}
            _hover={{ cursor: 'pointer', filter: 'brightness(1.2)' }}
            transition='all 0.1s ease-in-out'
          >
            {currentPrice}
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default StoreTile;

// The little box that represents a dude in a tile
const DudeChip: FC = () => <Box bg='lightgray' w={DUDE_SIZE} h={DUDE_SIZE} />;
