import Prac6 from "../components/Prac6";

export default function PracticaCasa() {
  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: 1, padding: "1rem" }}>
        <h2>Práctica: Casa con sombras y texturas</h2>
        <p>
          Aprender cómo funcionan{" "}
          <b>castShadow</b> y <b>receiveShadow</b> en Three.js, y cómo
          configurar luces, materiales y cielo con Lil-GUI.
        </p>
      </div>
      <div style={{ flex: 2 }}>
        <Prac6 />
      </div>
    </div>
  );
}
