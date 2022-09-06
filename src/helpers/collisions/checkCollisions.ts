import { Moveable } from 'types/Boxes';

const createCornersFromBox = (box: Moveable) => [
  [ box.x - box.size / 2, box.y - box.size / 2 ],
  [ box.x + box.size / 2, box.y - box.size / 2 ],
  [ box.x + box.size / 2, box.y + box.size / 2 ],
  [ box.x - box.size / 2, box.y + box.size / 2 ],
];

// What portion of the box's size to add to each side idk
const TOLERANCE = 1 + 0.25;

// The most basic implementation, checks for EXACT collisions of two square boxes
const checkCollisions = (subject: Moveable, moveables: Moveable[]) => {
  const subjectCorners = createCornersFromBox(subject);

  const collision = moveables.find(moveable => {
    const isColliding = subjectCorners.some(([ x, y ]) => {
      const isInside = (
        x >= moveable.x - (TOLERANCE * moveable.size) / 2 &&
        x <= moveable.x + (TOLERANCE * moveable.size) / 2 &&
        y >= moveable.y - (TOLERANCE * moveable.size) / 2 &&
        y <= moveable.y + (TOLERANCE * moveable.size) / 2
      );

      return isInside;
    });

    return isColliding;
  });

  return collision ?? null;
};

export default checkCollisions;
