import React from "react";
import Prac3 from "../components/Prac3";

export default function Practica3() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Introducción a las Luces</h1>
      <p>
        La iluminación es un componente crucial en cualquier entorno 3D...
      </p>

      <div style={{ height: "70vh" }}>
        {/* Modo R3F activado*/}
        <Prac3 useR3F />
      </div>
    </div>
  );
}
