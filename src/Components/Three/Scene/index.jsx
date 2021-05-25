import React, { useRef } from 'react';

import withKeyMap from 'Hoc/withKeyMap';
import useMount from 'Hooks/useMount';

import { ROTATIONS } from 'helpers/constans/three';

import Cube from 'Components/Three/Cube';
import { Canvas } from '@react-three/fiber';

const SceneComponent = (props) => {

  const cube = useRef();

  const performRotationWithKey = (rot) => {
    if (!cube.current || cube.current.isAnimate()) return;
    return cube.current.performRotation(rot.axis, rot.location, rot.rotation);
  };

  useMount(() => {
    props.setKeys({
      'u': () => performRotationWithKey(ROTATIONS.UP),
      'U': () => performRotationWithKey(ROTATIONS.UP2),
      'd': () => performRotationWithKey(ROTATIONS.DOWN),
      'D': () => performRotationWithKey(ROTATIONS.DOWN2),
      'l': () => performRotationWithKey(ROTATIONS.LEFT),
      'L': () => performRotationWithKey(ROTATIONS.LEFT2),
      'r': () => performRotationWithKey(ROTATIONS.RIGHT),
      'R': () => performRotationWithKey(ROTATIONS.RIGHT2),
      'f': () => performRotationWithKey(ROTATIONS.FRONT),
      'F': () => performRotationWithKey(ROTATIONS.FRONT2),
      'b': () => performRotationWithKey(ROTATIONS.BACK),
      'B': () => performRotationWithKey(ROTATIONS.BACK2),
    });
    props.focusKeys();
  });

  return (
    <Canvas style={{ height: 800, width: 1000 }}>
      <ambientLight intensity={0.5} />
      <spotLight angle={0.15} penumbra={1} position={[ 10, 10, 10 ]} />
      <pointLight position={[ -10, -10, -10 ]} />
      <Cube ref={cube} />
    </Canvas>
  );
};

export default withKeyMap(SceneComponent);
