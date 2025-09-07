import { useLoader } from "@react-three/fiber";
import React, { useRef, useEffect, useState } from "react";
import { TextureLoader } from "three";

const Prac1 = ({ bare = false }) => {
  const cubeTexture = useLoader(TextureLoader, "/assets/texture1.jpg");
  const sphereTexture = useLoader(TextureLoader, "/assets/texture2.jpg");
  const coneTexture = useLoader(TextureLoader, "/assets/alpha.png");

  const boxRef = useRef();
  const esfeRef = useRef();
  const groupRef = useRef();

  const [rotation, setRotation] = useState(0.01);

  useEffect(() => {
    let animationFrameId;
    const animate = () => {
      if (groupRef.current) {
        groupRef.current.rotation.y += rotation;
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, [rotation]);

  const handleClick = () => {
    setRotation((r) => (r === 0.01 ? 0.07 : 0.01));
  };

  return (
    <>
      {/* Solo muestra luces y piso si NO está en modo bare */}
      {!bare && (
        <>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial color="lightgray" />
          </mesh>
        </>
      )}

      {/* Este group interno es el que rota en Y con el click de la esfera */}
      <group ref={groupRef} position={[0, 0, 0]} castShadow>
        {/* Cubo */}
        <mesh ref={boxRef} position={[-4, 2, 0]} castShadow>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial map={cubeTexture} />
        </mesh>

        {/* Esfera (click para acelerar giro del group interno) */}
        <mesh
          ref={esfeRef}
          position={[0, 2, 0]}
          castShadow
          onPointerDown={handleClick}
        >
          <sphereGeometry args={[1.5, 32, 32]} />
          <meshStandardMaterial map={sphereTexture} />
        </mesh>

        {/* Cono */}
        <mesh position={[4, 1, 0]} castShadow>
          <coneGeometry args={[1, 3, 32]} />
          <meshStandardMaterial map={coneTexture} />
        </mesh>
      </group>
    </>
  );
};

export default Prac1;
