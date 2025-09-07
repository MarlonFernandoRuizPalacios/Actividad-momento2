import React from "react";
import Prac5 from "../components/Prac5";

const Practica5 = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <h3>Practica-5: Materiales y Sombras</h3>
      <p style={{ opacity: 0.85 }}>
        Cambia entre MeshStandard / MeshPhong / MeshLambert desde el panel. 
        Con Standard ajusta metalness y roughness. Observa cómo cambian reflejos y sombras.
        Agregamos un cubo con el mismo material para comparar bajo las mismas luces.
      </p>
      <Prac5 />
    </div>
  );
};

export default Practica5;
