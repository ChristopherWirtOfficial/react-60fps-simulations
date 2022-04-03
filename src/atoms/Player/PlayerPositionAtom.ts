import { atom } from 'recoil';

/*
    Which coordinate system should we use?
    Is there a good reason to use anything other than the coordinate system relative to the container div?

    It does almost sound nice to make the center and the origin both (0,0) and operate from there
    But then we need to create an interface that translates from our pixels with origin at the center to our pixels with origin at the top-left corner
    So any time we need to actually render something on-screen with an X and Y value, we'll have to translate it to the top-left corner origin first
*/
export default atom({
  key: 'playerPosition',

  // As of now, all positions are in pixels with the 0,0 being the top-left corner of the container div
  default: {
    x: 140,
    y: 140,
  },
});
