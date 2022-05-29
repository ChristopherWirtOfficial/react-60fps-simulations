import React, { createContext, useContext, useMemo, FC } from 'react';
import { Moveable } from './useMovement';

export interface Damageable {
  health: number;
  maxHealth: number;

}

export interface Entity extends Moveable {
  key: string;
  type: string;
  size: number;
  color: string;
}


export type EntityContextT = {
  entities: {
    [key: string]: Entity;
  };
  addEntity: (entity: Entity) => void;
  removeEntity: (key: string) => void;
  updateEntity: (entity: Entity) => void;
};

const EntityContext = createContext<EntityContextT>({
  entities: {},
  addEntity: () => {},
  removeEntity: () => {},
  updateEntity: () => {},
});


const entities = {} as {
  [key: string]: Entity;
};

const addEntity = (entity: Entity) => {
  entities[entity.key] = entity;
};

const removeEntity = (key: string) => {
  delete entities[key];
};

// This overwrites the entity entirely with a new object, which could lead to garbage collection issues.
// Consider re-writing this to update the entity in place, somehow...
const updateEntity = (entity: Entity) => {
  entities[entity.key] = entity;
};

const EntityProvider: FC = ({ children }) => {
  const context = useMemo(() => ({
    entities,
    addEntity,
    removeEntity,
    updateEntity,
  }), []);

  return (
    <EntityContext.Provider value={ context }>{ children }</EntityContext.Provider>
  );
};

export default EntityProvider;

export const useEntities = () => {
  const context = useContext(EntityContext);

  return context;
};

export const useEntity = (key: string) => {
  const { entities: entityList } = useEntities();
  return entityList[key];
};
