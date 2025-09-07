import React from "react";
import Prac4 from "../components/Prac4";

const Practica4 = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <h3>Practica-4: lil-gui con luces</h3>
      <p style={{ opacity: 0.8, marginBottom: 12 }}>
        Usa el panel para encender/apagar luces, dejar solo una y cambiar intensidades/colores. Toma capturas para cada caso.
      </p>
      <Prac4 />
    </div>
  );
};

export default Practica4;
