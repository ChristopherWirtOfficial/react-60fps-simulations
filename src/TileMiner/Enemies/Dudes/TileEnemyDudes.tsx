import { FC } from 'react';
import { TileEnemyIdentifer } from 'types/TileEnemy';
import { useAtomValue } from 'jotai';
import { Box, Flex, Grid, HStack } from '@chakra-ui/react';
import useTick from 'hooks/useTick';
import { TICKS_BETWEEN_ATTACKS } from 'helpers/knobs';
import { TileEnemyAssignedDudes } from './TileEnemyDudesAtoms';
import useProjectileHit, { useDudeHits } from '../atoms/useProjectileHit';

const DUDE_DAMAGE = 5;

// TODO: Consider making this render a bunch of individual TileDude components that all control their own tick
// Benefits include:
//      1. The feeling of the dudes being more individual, especially when they're synced with when they were
//         added, and not just based on the number of dudes on the tile and some global timer for that tile's damage check
//      2. Other nice things, like the dudes falling off the tile when it's destroyed? (Maybe that's actually harder haha)
//   But the biggest consideration!
//     - The dudes would probably need IDs then..
//        Incrementing and decrementing the counter only affecting the "last" dude sucks if there's a reason to
//        actually differentiate between them. And if there's not, then why get cute about it? Idk maybe I'm overthinking
//        it, as usual ;)
const TileEnemyDudes: FC<{ enemyId: TileEnemyIdentifer }> = ({ enemyId }) => {
  // The number of dudes on the tile
  const dudesCount = useAtomValue(TileEnemyAssignedDudes(enemyId));

  const dudes = Array.from({ length: dudesCount }, (_, i) => i);


  const { addDudeHit } = useDudeHits(enemyId);

  // Based on how many dudes, a certain amount of damage is done to the tile on each hit
  // Each hit is every X ticks
  useTick(() => {
    // TODO: What about overhit protection? automatically unassign dudes if they're going to overhit on the next hit
    //        This is best done after we move the damage to individual dudes
    const collectiveDudeDamage = DUDE_DAMAGE * dudesCount;

    addDudeHit(collectiveDudeDamage);
  }, TICKS_BETWEEN_ATTACKS);

  return (
    <Flex wrap='wrap' p={ 1.5 } justifyContent='left' gap={ 1.5 } flex='1'>
      {
        dudes.map(dude => (
          <Box w={ size } h={ size } bg='gray.500' key={ dude } boxShadow='md' />
        ))
      }
    </Flex>
  );
};

export default TileEnemyDudes;
