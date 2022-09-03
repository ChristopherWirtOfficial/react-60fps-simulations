import { Moveable } from 'types/Boxes';

type CollisionVector = {
  x: number,
  y: number,
  direction: number,
  length: number,
  width: number,
};

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
const checkCollisions =
  <TSubject extends Moveable, TMoveables extends Moveable>
  (subject: TSubject, moveables: TMoveables[]) => {
  // For every moveable in the list, check if it's colliding with the subject
  // If it is, return the moveable

    // Create a "Collision Vector" for a moveable, which is a rectangle that covers the space the
    //  moveable has occupied across the last two ticks. This is to account for the fact that
    //  things can move multiple pixels per tick, and may "jump" over things they really collided with.
    // The vector is drawn from the moveable's previous position to its current position, and has a width of the box's size
    const moveableToCollisionVector = (moveable: Moveable) => {
      const {
        x, y, prevX, prevY, size,
      } = moveable;

      // If the moveable has no previous position, use its current position
      const startX = prevX ?? x;
      const startY = prevY ?? y;

      return {
        x: startX,
        y: startY,
        direction: Math.atan2(y - startX, x - startY),
        length: Math.sqrt((x - startX) ** 2 + (y - startY) ** 2),
        width: size,
      };
    };

    const subjectCollisionVec = moveableToCollisionVector(subject);

    // For every moveable, check if it's colliding with the subject
    const collision = moveables.find(moveable => {
      const rect = moveableToCollisionVector(moveable);

      // Check if the subject's rectangle is colliding with the moveable's rectangle
      const isColliding = (
        subjectCollisionVec.x < rect.x + rect.length &&
        subjectCollisionVec.x + subjectCollisionVec.length > rect.x &&
        subjectCollisionVec.y < rect.y + rect.width &&
        subjectCollisionVec.y + subjectCollisionVec.width > rect.y
      );

      return isColliding ? moveable : null;
    });

    return collision;
  };

export default checkCollisions;
