import React from "react";
import Objgrupothrjs from "../components/Objgrupothrjs";


const Ejercicio5 = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <h3>Agrupacion de Elementos sin @react-three/fiber</h3>

      <div style={{
        backgroundColor: "black",
        color: "white",
        minHeight: "100vh",
      }}>
        <Objgrupothrjs />
      </div>
    </div>
  );
};

export default Ejercicio5;
