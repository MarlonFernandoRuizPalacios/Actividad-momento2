import React from "react";
import Texturas from "../components/Texturas";

/**
 * Se muestra un cubo animado que rota y se desplaza, mostrando dos texturas alternadas en sus caras.
 */
const Ejercicio2 = () => {
  return (
    <div style={{
      backgroundColor: "black",
      color: "white",
      minHeight: "100vh",
    }}>
      <h3>Texturas y Animación en un Cubo</h3>
      <div style={{ height: "500px" }}>
        <Texturas />
      </div>
    </div>
  );
};

export default Ejercicio2;
