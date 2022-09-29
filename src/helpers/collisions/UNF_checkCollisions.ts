import { Moveable } from 'types/Boxes';

type EdgeVector = {
  x: number,
  y: number,
  direction: number,
  length: number,
};


const moveableToCollisionVectors = (moveable: Moveable) => {
  const {
    x, y, prevX, prevY, size,
  } = moveable;

  // If the moveable has no previous position, use its current position (The center of the box)
  const startCenterX = prevX ?? x;
  const startCenterY = prevY ?? y;

  const endCenterX = x;
  const endCenterY = y;

  // Calculate the direction of the vector
  const direction = Math.atan2(endCenterY - startCenterY, endCenterX - startCenterX);

  // The length between the two centers of the boxes, doesn't account for box size
  const length = Math.sqrt((endCenterX - startCenterX) ** 2 + (endCenterY - startCenterY) ** 2);

  const vectorLength = length + size;
  const vectorWidth = size;

  // Idk how to define these, but "Top" is at the end of the vector, bottom is at the start
  // left and right are perpendicular to the vector
  // This is what I get for using
  const topLeft = { x: endCenterX - size / 2, y: endCenterY - size / 2 };
  const topRight = { x: endCenterX + size / 2, y: endCenterY - size / 2 };
  const bottomLeft = { x: startCenterX - size / 2, y: startCenterY + size / 2 };
  const bottomRight = { x: startCenterX + size / 2, y: startCenterY + size / 2 };

  // Calculate the 4 edge vectors of the moveable's collision vector
  // The collision vector is drawn from the moveable's previous position to its current position, and has a width of the box's size
  // Two of the edge vectors are exactly the same length as the moveable's box size,
  //  and the other two are the length of the distance between the moveable's previous and
  //   current positions + two halves of the box size (one box size)

  // The edge vectors are drawn from each corner toward the corner clockwise from it
  const edgeVectors: EdgeVector[] = [
    {
      ...topLeft,
      // Points at top right
      direction: direction + Math.PI / 4,
      // one of the two "short" sides (width is actually probably longer than the length but who cares lol)
      length: vectorWidth,
    },
    {
      ...topRight,
      // Points at bottom right
      direction: direction + Math.PI / 2,
      length: vectorLength,
    },
    {
      ...bottomRight,
      // Points at bottom left
      direction: direction + (Math.PI * 3 / 4),
      length: vectorWidth,
    },
    {
      ...bottomLeft,
      // Points at top left
      direction,
      length: vectorLength,
    },
  ];

  return edgeVectors;
};


/*
  Another helper method to try and see if two EdgeVectors are intersecting by being contained in the other

  Idk if this works, and I kind of assume it doesn't :/
*/
const checkCornersContained = (
  firstMoveableVecs: EdgeVector[],
  secondMoveableVecs: EdgeVector[],
) => secondMoveableVecs.some(({ x, y }) => firstMoveableVecs.some(subjectEdgeVector => {
  console.log('Checking if', x, y, 'is contained in', subjectEdgeVector);
  const { x: subjectX, y: subjectY, direction: subjectDirection, length: subjectLength } = subjectEdgeVector;

  // Calculate the vector from the subject's edge vector to the moveable's edge vector
  const subjectToMoveableX = x - subjectX;
  const subjectToMoveableY = y - subjectY;

  // Calculate the cross product of the subject's edge vector and the vector from the subject's edge vector to the moveable's edge vector
  const crossProduct = (
    subjectToMoveableX * Math.sin(subjectDirection) - subjectToMoveableY * Math.cos(subjectDirection)
  );

  // If the cross product is less than the length of the subject's edge vector, the moveable's edge vector is inside of the subject's edge vector
  return crossProduct < subjectLength;
}));


/*
  * Check if two moveables are colliding
  *
  * @param {Moveable} moveable1
  * @param {Moveable} moveable2
  * @returns {boolean} Whether the two moveables are colliding
 */
// TODO: This doesn't work and I only sort of understand the math for it, so I'm skipping for now
const checkCollision =
  <TSubject extends Moveable, TMoveables extends Moveable>
  (subject: TSubject, moveables: TMoveables[]) => {
    const subjectCollisionVec = moveableToCollisionVectors(subject);

    // For every moveable, check if it's colliding with the subject
    const collision = moveables.find(moveable => {
      const moveableCollisionVector = moveableToCollisionVectors(moveable);

      /*
        Possible cases:
        1. The Moveable's CV is NOT intersecting with the subject's CV
        2. The Moveable's CV is completely inside of the subject's CV, or vice versa
        3. At least one of the moveable's CV's "edge vectors" is intersecting with at least one of the subject's CV's "edge vectors"

        An edge vector is a vector drawn from a corner of the CV to the corner clockwise from it. We can use these to check if the CVs are intersecting
         by using vector cross products to check if any of the edge vectors overlap
      */


      // Check if any of the corners of the moveable's CV are inside of the subject's CV, or vice versa
      const moveableCornersInsideSubject = checkCornersContained(subjectCollisionVec, moveableCollisionVector);
      const subjectCornersInsideMoveable = checkCornersContained(moveableCollisionVector, subjectCollisionVec);

      // If the moveable's CV is completely inside of the subject's CV, or vice versa, return true
      if (moveableCornersInsideSubject || subjectCornersInsideMoveable) {
        return true;
      }

      // TODO: COLLISIONS: The other half of this function is unfinished
      return false;

      // Check if any of the moveable's CV's edge vectors are intersecting with any of the subject's CV's edge vectors
    });

    return collision;
  };


export default checkCollisions;


// TODO: Consider if ... we should be projecting forward in time one tick to know that next tick we'll collide
//  My thinking behind this is that it currently looks wonky to have the projectile phase through the enemy
//  only to still "hit" it on that tick. Instead, it would make WAY more sense to have the projectile
//  collide with the enemy on the tick that it actually hits it. This would require projecting forward in time
//  one tick worth of movement step to know if we hit something on the next tick, and then adjusting the movement
//   we actually execute to stop at the collision point.
//  NOTE: That's probably a lot of work for a small visual improvement, but it's worth considering
//  NOTE: Adjusting the movement almost certainly means changing the movement steps on the fly lmao
// YOOOOO what if collisions were a movement step? That would be so cool. I could have a collision step that
//  checks for collisions and then adjusts the movement vector to stop at the collision point, then I can make the
//  actual collision detection WAY SIMPLER

// YES ABSOLUTELY! I'll just split the "I'm a big rectangle projecting into the future" into a separate step
//  from checking if the actual rectangles collide, because if the first step says "collision of any kind on next tick"
//  then the next tick we will litrally be warped into the perfect position to collide with the thing we're colliding with,
//  which can then be checked with really really simple logic. I think this is the way to go. AT SOME POINT. It's already working rn
