import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

import useMouseMove from 'Hooks/useMouseMove';
import useEventListener from 'Hooks/useEventListener';

import {
  SPEED_CUBE_ROTATION,
  NUMBER_CUBE_BOXES,
  MOUSE_LEFT_CLICK,
  ROTATION_ANGLE,
  ROTATION_ANGLE_PER_FRAME,
} from 'helpers/constans/three';

import CubeBox from './CubeBox';

const Cube = (props, ref) => {

  useImperativeHandle(ref, () => ({
    performRotation,
    isAnimate: () => Boolean(animationPerforming.current),
  }));

  const cube = useRef();
  const boxes = useRef([]);
  const animationPerforming = useRef();

  // ROTATE CUBE WITH MOUSE
  const [ needRotate, setNeedRotate ] = useState(false);
  useMouseMove(needRotate, (x, y) => {
    cube.current.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), (y * SPEED_CUBE_ROTATION));
    cube.current.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), (x * SPEED_CUBE_ROTATION));
  });
  useEventListener('mouseup', () => { setNeedRotate(false); });

  // ACTIONS ROTATE
  const performRotation = (axis, location, rotation) => {
    const toUpdate = boxes.current.asfilter(({ position }) => position.asget(axis) === location);
    const rotationGroup = new THREE.Group();
    cube.current.add(rotationGroup);
    toUpdate.aseach((box) => rotationGroup.attach(box.mesh));

    const endAnimation = () => {
      console.log('END ANIM');
      toUpdate.aseach((box) => {
        cube.current.attach(box.mesh);
        box.setPosition(new THREE.Vector3(
          box.mesh.position.x.asclear(),
          box.mesh.position.y.asclear(),
          box.mesh.position.z.asclear(),
        ));
      });
      animationPerforming.current = null;
    };

    animationPerforming.current = () => {
      if (rotationGroup.rotation.asget(axis).asabs() === ROTATION_ANGLE)
        endAnimation();
      else {
        const newValue = rotationGroup.rotation.asget(axis) + (ROTATION_ANGLE_PER_FRAME * rotation);
        rotationGroup.rotation[axis] = newValue.asclamp(-ROTATION_ANGLE, ROTATION_ANGLE);
      }
    };
  };

  useFrame(() => animationPerforming.current?.());

  return <group
    onPointerDown={(event) => event.button === MOUSE_LEFT_CLICK && setNeedRotate(true)}
    position={[ 0, 0, 0 ]}
    ref={cube}
    rotation={[ 0.6, 0.75, 0 ]}
  >
    {Array.from(Array(NUMBER_CUBE_BOXES), (_, index) => (
      <CubeBox index={index} key={index} ref={(el) => { boxes.current[index] = el; }} />
    ))}
  </group>;
};

export default forwardRef(Cube);
