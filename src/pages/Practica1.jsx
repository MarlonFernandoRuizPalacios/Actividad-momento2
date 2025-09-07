// pages/Practica1.jsx
import React, { useState } from "react";
import Objgrupo from "../components/Prac1"; // tu Prac1 con prop bare
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";

const PRESETS = ["sunset", "forest", "warehouse"];

const Practica1 = () => {
  const [preset, setPreset] = useState(PRESETS[0]);
  const [background, setBackground] = useState(true);

  return (
    <div style={{ padding: "2rem" }}>
      <h3 style={{ marginBottom: 12 }}>Practica-1</h3>

      {/* Menú para elegir preset y activar background */}
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
        <label>
          Preset:{" "}
          <select value={preset} onChange={(e) => setPreset(e.target.value)}>
            {PRESETS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </label>

        <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input
            type="checkbox"
            checked={background}
            onChange={(e) => setBackground(e.target.checked)}
          />
          Fondo como background
        </label>
      </div>

      <div style={{ height: "600px" }}>
        <Canvas
          className="position-absolute w-100 h-100"
          style={{ position: "fixed", width: "100vw", height: "100vh" }}
          camera={{ position: [10, 5, 10], fov: 40 }}
          shadows
        >
          <axesHelper args={[2]} />
          <Environment
            preset={preset}
            background={background}
            backgroundBlurriness={0.4}
          />
          {/* Grupo 1: usa el prop position */}
          {/* mueve todo el grupo hacia la izquierda en la escena*/}
          <group
            position={[-10, 0, 0]}
            rotation={[8, 0, 0]}
            scale={[1, 1, 1]}
            name="Position"
          >
            <Objgrupo bare />
          </group>
          {/* Grupo 2: usa el prop scale */}
          {/*aumenta el tamaño de todo el grupo en los ejes X y Z */}
          <group
            position={[0, 0, 0]}
            rotation={[10, 0, 0]}
            scale={[1.3, 1, 1.3]}
            name="scale"
          >
            <Objgrupo bare />
          </group>
          {/* Grupo 3: usa el prop visible */}
          {/*controla si el grupo entero se renderiza o no*/}
          <group
            position={[10, 0, 0]}
            rotation={[15, 0, 0]}
            scale={[0.9, 1.2, 0.9]}
            visible={true}
            name="visible"
          >
            <Objgrupo bare />
          </group>
          <OrbitControls enableRotate />
        </Canvas>
      </div>
    </div>
  );
};

export default Practica1;
