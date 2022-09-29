import { SpawnProjectile } from 'atoms/Projectiles/ProjectileAtomFamily';
import { BASE_PROJECTILE_SPEED, PROJECTILE_DAMAGE, PROJECTILE_SIZE, TICKS_BETWEEN_ATTACKS } from 'helpers/knobs';
import useTick from 'hooks/useTick';
import { useSetAtom } from 'jotai';
import { TileMinerPlayer } from 'types/TileMinerPlayer';

import { TileMinerGun } from './useGun';

const useShootProjectiles = (player: TileMinerPlayer, gun: TileMinerGun | undefined) => {
  const spawnProjectile = useSetAtom(SpawnProjectile);

  useTick(() => {
    const newProj = {
      x: gun?.x ?? player.x,
      y: gun?.y ?? player.y,
      direction: player.firingDirection ?? 0,
      speed: BASE_PROJECTILE_SPEED,
      movementSteps: [],
      size: PROJECTILE_SIZE,
      damage: PROJECTILE_DAMAGE,
      sourceX: player.x,
      sourceY: player.y,
      targetKey: 'FAKE_TARGET_KEY',
    };

    spawnProjectile(newProj);
  }, TICKS_BETWEEN_ATTACKS);
};

export default useShootProjectiles;
