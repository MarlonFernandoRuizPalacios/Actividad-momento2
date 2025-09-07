import React, { useState } from "react";
import Objgrupo from "../components/objgrupo";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";

const PRESETS = ["sunset", "forest", "warehouse"];

const Ejercicio4 = () => {
  const [preset, setPreset] = useState(PRESETS[0]);
  const [background, setBackground] = useState(true);

  return (
    <div style={{ padding: "2rem" }}>
      <h3 style={{ marginBottom: 12 }}>3 Valores de Preset</h3>

      {/* Menu para elegir el tipo de preset */}
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
        >
          <axesHelper args={[2]} />
          {/* selecion del preset/background a partir del estado */}
          <Environment preset={preset} background={background} backgroundBlurriness={0.4} />
          <Objgrupo />
          <OrbitControls enableRotate />
        </Canvas>
      </div>
    </div>
  );
};

export default Ejercicio4;
