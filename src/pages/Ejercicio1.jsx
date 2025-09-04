import React from "react";
import Geometrias from "../components/geometrias";

/**
 * Se muestra la utilización de distintos tipos de geometrías en Three.js usando react-three-fiber.
 */
const Ejercicio1 = () => {
  return (
    <div
      style={{
        backgroundColor: "black",   
        color: "white",           
        minHeight: "100vh",      
      }}
    >
      <h3>Tipos de Geometrías en Three.js</h3>
      <div style={{ height: "500px" }}>
        <Geometrias />
      </div>
    </div>
  );
};

export default Ejercicio1;
