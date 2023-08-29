import React, { FC, PropsWithChildren } from 'react';
import { GameCoords } from 'types/Game';

const OriginContext = React.createContext<GameCoords | undefined>(undefined);

export const useTileGridOrigin = (): GameCoords => {
  const context = React.useContext(OriginContext);
  if (!context) {
    throw new Error('useTileGridOrigin must be used within a RelativeTileGrid');
  }
  return context;
};

export const TileGridOriginProvider: FC<PropsWithChildren & { origin: GameCoords }> =
  ({ origin, children }) => <OriginContext.Provider value={ origin }>{ children }</OriginContext.Provider>;

export default TileGridOriginProvider;
