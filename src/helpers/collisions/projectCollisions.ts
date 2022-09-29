import { MAX_BETWEEN_TICK_RESOLUTION } from 'helpers/knobs';
import { Moveable } from 'types/Boxes';
import { DeltaVector } from 'types/Physics';
import moveableToDeltaVector from './moveableToDeltaVector';

// Helper to find the center of a vector
const findDeltaVectorCenter = (deltaVector: DeltaVector) => {
  const x = deltaVector.x + Math.cos(deltaVector.direction) * deltaVector.length / 2;
  const y = deltaVector.y + Math.sin(deltaVector.direction) * deltaVector.length / 2;
  return { x, y };
};


/**
 * @name checkDeltaVectorCollision
 * @description A simple method of checking for collisions between DeltaVectors
 *
 * @param deltaVectorA
 * @param deltaVectorB
 */
const checkDeltaVectorCollision = (deltaVectorA: DeltaVector, deltaVectorB: DeltaVector) => {
  const centerA = findDeltaVectorCenter(deltaVectorA);
  const centerB = findDeltaVectorCenter(deltaVectorB);

  const deltaX = centerB.x - centerA.x;
  const deltaY = centerB.y - centerA.y;

  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

  // The distance between the centers of the two DVs plus 0.5*2*boxSize for each box (since the box is centered on the DV's endpoints)
  const totalLength = deltaVectorA.length + deltaVectorB.length + deltaVectorA.boxSize + deltaVectorB.boxSize;

  // If the center of the delta vectors are closer than the sum of their lengths, they are "colliding"
  // (Or at least a naive circle of possible collision are colliding)
  return distance < totalLength;
};


// TODO: COLLISIONS - Go back to the original idea for a collision method
// Check between 0 and MAX_BETWEEN_TICK_RESOLUTION fake steps along the Delta Vector

// const checkCollisionsSimple = (subject: Moveable, moveables: Moveable[]) => {
//   const subjectDeltaVector = moveableToDeltaVector(subject);

//   const collisions = moveables.filter(moveable => {
//     // Simulate the moveable one tick into the future and get the delta vector
//     const moveableDeltaVector = moveableToDeltaVector(moveable);
//     return checkDeltaVectorCollision(subjectDeltaVector, moveableDeltaVector);
//   });

//   return collisions;
// };

// const checkCollisions = (subject: Moveable, moveables: Moveable[]) => {
//   const collisions = checkCollisionsSimple(subject, moveables);

//   return collisions[0] ?? null;
// };

const generateFakeBoxes = (moveable: Moveable) => {
  const deltaVector = moveableToDeltaVector(moveable);

  const numBoxes = Math.min(Math.ceil(deltaVector.length / deltaVector.boxSize), MAX_BETWEEN_TICK_RESOLUTION);

  const fakeBoxes = Array.from({ length: numBoxes }).map((_, i) => {
    const fakeBox = {
      ...moveable,
      x: deltaVector.x + Math.cos(deltaVector.direction) * deltaVector.boxSize * i,
      y: deltaVector.y + Math.sin(deltaVector.direction) * deltaVector.boxSize * i,
    };

    return fakeBox;
  });

  return fakeBoxes;
};


// TODO: COLLISIONS - Although this is basically how it should work, the collision detection needs to be closer to perfect.
//   My naive "fix" is to find a more "middle" fake box that collides much more closesly with the average of the enemy's fake boxes idk
// The real answer is definitely to just do this more correctly and find the exact point of collision and warp both parties to it
// Know which enemy we'll hit and where we should be to hit them
const projectCollision = (subject: Moveable, moveables: Moveable[]) => {
  const fakeSubjectBoxes = generateFakeBoxes(subject);

  // Awful name lmao
  const collisionKnowledge = moveables.find(moveable => {
    const fakeMoveableBoxes = generateFakeBoxes(moveable);

    // The first fake (subject) box that collides with a fake moveable box is the collision point
    const collision = fakeSubjectBoxes.find(fakeSubjectBox => {
      const fakeBoxCollisions = fakeMoveableBoxes.filter(fakeMoveableBox => {
        // Given the center of the fake boxes and their boxSize, check if they are colliding
        const deltaX = fakeMoveableBox.x - fakeSubjectBox.x;
        const deltaY = fakeMoveableBox.y - fakeSubjectBox.y;

        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const maxCenterDistanceIndicatingCollision = fakeSubjectBox.size + fakeMoveableBox.size;

        const isColliding = distance < maxCenterDistanceIndicatingCollision;

        return isColliding;
      });

      return fakeBoxCollisions[fakeBoxCollisions.length / 2];
    });

    // If there's a collision, we now know where the subject should end up on the collision tick (next tick, probably)
    // This is a fake SUBJECT box
    return collision;
  });

  return collisionKnowledge;
};

export default projectCollision;
