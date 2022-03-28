import React, { useState } from 'react';

export interface BasicBoxProps {
  width: number;
  height: number;
}

const BasicBox: React.FC<BasicBoxProps> = ({ width, height }) => {
  const [ x, setX ] = useState(10);
  const [ y, setY ] = useState(10);

  return (
    <div style={ {

      position: 'absolute',
    } }
    />
  );
};

export default BasicBox;
