/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.8 untitled.glb
*/

import React, { useRef, useEffect } from 'react'
import { useGLTF, useAnimations, MeshTransmissionMaterial, Float } from '@react-three/drei'

export function Diamond(props) {
  const group = useRef()
  const { nodes, materials, animations } = useGLTF('/models/diamond.glb')
  const { actions } = useAnimations(animations, group)
  useEffect(() => {
    // console.log('animations', animations)
    // actions.KeyAction.play()
  });
  return (
    <>
      <Float>
        <group ref={group} {...props} dispose={null}>
          <group name="Scene">
            {/* <mesh name="Icosphere" geometry={nodes.Icosphere.geometry} material={materials['Material.001']} morphTargetDictionary={nodes.Icosphere.morphTargetDictionary} morphTargetInfluences={nodes.Icosphere.morphTargetInfluences}>
              <MeshTransmissionMaterial
                chromaticAberration={1}
                thickness={0.3}
                transmission={1}
                anisotropy={0.5}
                distortion={5}
                distortionScale={1.5}
                temporalDistortion={0.1}
                metalness={0.1}
                backside
                resolution={256}
                backsideResolution={256}
              />
            </mesh> */}
            <mesh name="Diamond" geometry={nodes.Diamond.geometry} material={materials['Material.001']} morphTargetDictionary={nodes.Diamond.morphTargetDictionary} morphTargetInfluences={nodes.Diamond.morphTargetInfluences}>
          </mesh>
          </group>
        </group>
      </Float>
    </>
  )
}

useGLTF.preload('/models/diamond.glb')
