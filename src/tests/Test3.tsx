import React, { useState } from 'react';

import useTick from '../hooks/useTick';
import { now } from '../helpers';
import useTimedAverage from '../hooks/useTimedAverage';

const Test3: React.FC = () => {
  const [ countA, setCountA ] = useState(0);
  const { progress: progA } = useTick(() => {
    setCountA(c => c + 1);
  }, 10);

  const [ countB, setCountB ] = useState(0);
  const { progress: progB } = useTick(() => {
    console.log('tick');
    setCountB(c => c + 1);
  }, 100);

  const [ countC, setCountC ] = useState(0);
  const { progress } = useTick(() => {
    setCountC(c => c + 1);
  }, 1000);


  return (
    <div>
      <div>
        { countA } { countB } { countC }
        <br />
        { Math.floor(countA / 10) / countB || 1 }
        <br />
        { Math.floor(countB / 10) / countC || 1 }
        <br />
        Progress: { (progress * 100).toFixed(2) }
        <br />
        Prog A: { progA }
        <br />
        Prog B: { progB }
      </div>
    </div>
  );
};

export default Test3;
