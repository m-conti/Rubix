import React, {
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
  Ref,
} from 'react';

import { MeshProps, Vector3 } from '@react-three/fiber';
import * as THREE from 'three';
import {
  COLOR_RIGHT,
  COLOR_LEFT,
  COLOR_UP,
  COLOR_DOWN,
  COLOR_FRONT,
  COLOR_BACK,
  COLOR_HIDE
} from 'helpers/constans/three';

interface ICubeBoxProps extends MeshProps {
  index: number
}

interface ICubeBoxRef {
  position: Vector3;
  setPosition: React.Dispatch<React.SetStateAction<THREE.Vector3>>;
}

const makePosFromIndex = (index: number) => new THREE.Vector3(
  (index % 3) - 1,
  (Math.trunc(index / 3) % 3) - 1,
  Math.trunc(index / 9) - 1
);

const CubeBox = (props: ICubeBoxProps, ref: Ref<ICubeBoxRef>): JSX.Element => {

  useImperativeHandle(ref, () => ({
    mesh: mesh.current,
    position,
    setPosition,
  }));

  const [ position, setPosition ] = useState(() => makePosFromIndex(props.index));
  const [defaultPosition] = useState(position);
  const [materials] = useState(() => [
    new THREE.MeshStandardMaterial({ color: defaultPosition.asget('x') === 1 ? COLOR_RIGHT : COLOR_HIDE }),
    new THREE.MeshStandardMaterial({ color: defaultPosition.asget('x') === -1 ? COLOR_LEFT : COLOR_HIDE }),
    new THREE.MeshStandardMaterial({ color: defaultPosition.asget('y') === 1 ? COLOR_UP : COLOR_HIDE }),
    new THREE.MeshStandardMaterial({ color: defaultPosition.asget('y') === -1 ? COLOR_DOWN : COLOR_HIDE }),
    new THREE.MeshStandardMaterial({ color: defaultPosition.asget('z') === 1 ? COLOR_FRONT : COLOR_HIDE }),
    new THREE.MeshStandardMaterial({ color: defaultPosition.asget('z') === -1 ? COLOR_BACK : COLOR_HIDE }),
  ]);
  const mesh = useRef();

  return <mesh material={materials} position={position} ref={mesh}>
    <boxBufferGeometry args={[ 0.96, 0.96, 0.96 ]} attach='geometry' />
  </mesh>;
};

export default forwardRef(CubeBox);
