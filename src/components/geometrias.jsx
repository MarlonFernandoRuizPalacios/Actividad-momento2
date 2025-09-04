import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

export default function GeometryExplorer() {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const currentMeshRef = useRef(null);

  const [autoRotate, setAutoRotate] = useState(true);
  const [wireframe, setWireframe] = useState(false);
  const [showHelpers, setShowHelpers] = useState(true);
  const [selectedGeometry, setSelectedGeometry] = useState("sphere");

  // Geometrías disponibles
  const geometries = useMemo(
  () => ({
    sphere: {
      name: "Sphere",
      category: "Primitivas",
      description: "Esfera",
      create: () => new THREE.SphereGeometry(1, 32, 16),
      color: "#FF6B6B",
    },
    box: {
      name: "Box",
      category: "Primitivas",
      description: "Cubo",
      create: () => new THREE.BoxGeometry(2, 2, 2, 16, 16, 16),
      color: "#FFD93D",
    },
    plane: {
      name: "Plane",
      category: "Primitivas",
      description: "Plano",
      create: () => new THREE.PlaneGeometry(2, 2, 10, 10),
      color: "#4ECDC4",
    },
    cone: {
      name: "Cone",
      category: "Primitivas",
      description: "Cono",
      create: () => new THREE.ConeGeometry(1, 2, 16),
      color: "#45B7D1",
    },
    line: {
      name: "Line",
      category: "Otros",
      description: "Línea",
      create: () =>
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(-1, 0, 0),
          new THREE.Vector3(1, 0, 0),
        ]),
      color: "#FF7043",
      isLine: true,
    },
    points: {
      name: "Points",
      category: "Otros",
      description: "Puntos",
      create: () => {
        const v = [];
        for (let i = 0; i < 400; i++) {
          v.push(
            (Math.random() - 0.5) * 3,
            (Math.random() - 0.5) * 3,
            (Math.random() - 0.5) * 3
          );
        }
        const g = new THREE.BufferGeometry();
        g.setAttribute("position", new THREE.Float32BufferAttribute(v, 3));
        return g;
      },
      color: "#8E24AA",
      isPoints: true,
    },
  }),
  [wireframe]
);


  // Función que crea la malla según el tipo
  function buildMeshFor(key) {
    const g = geometries[key];
    const geometry = g.create();
    const color = new THREE.Color(g.color);

    if (g.isLine) {
      return new THREE.Line(geometry, new THREE.LineBasicMaterial({ color }));
    }
    if (g.isPoints) {
      return new THREE.Points(
        geometry,
        new THREE.PointsMaterial({ color, size: 0.05, sizeAttenuation: true })
      );
    }
    return new THREE.Mesh(
      geometry,
      new THREE.MeshPhongMaterial({ color, wireframe })
    );
  }

  // Configuración inicial
  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    sceneRef.current = scene;

    const { width, height } = mountRef.current.getBoundingClientRect();
    const camera = new THREE.PerspectiveCamera(
      75,
      (width || 800) / (height || 600),
      0.1,
      1000
    );
    camera.position.set(3, 3, 6);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width || 800, height || 600);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x0a0a0a); // 🔥 fondo oscuro fijo
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Luces
    const ambient = new THREE.AmbientLight(0xffffff, 0.6); // más brillante
    scene.add(ambient);

    const dir = new THREE.DirectionalLight(0xffffff, 2.0); // luz más fuerte
    dir.position.set(5, 5, 5);
    scene.add(dir);

    // opcional: luz direccional secundaria para rellenar sombras
    const dir2 = new THREE.DirectionalLight(0xffffff, 0.5);
    dir2.position.set(-5, -3, -5);
    scene.add(dir2);


    // Helpers iniciales
    if (showHelpers) {
      scene.add(
        new THREE.AxesHelper(2),
        new THREE.GridHelper(10, 10, 0x444444, 0x222222)
      );
    }

    // Malla inicial
    const mesh = buildMeshFor(selectedGeometry);
    currentMeshRef.current = mesh;
    scene.add(mesh);

    // Animación
    renderer.setAnimationLoop(() => {
      if (autoRotate && currentMeshRef.current) {
        currentMeshRef.current.rotation.x += 0.01;
        currentMeshRef.current.rotation.y += 0.015;
      }
      renderer.render(scene, camera);
    });

    // Resize handler
    const handleResize = () => {
      if (!mountRef.current) return;
      const rect = mountRef.current.getBoundingClientRect();
      const w = rect.width || 800,
        h = rect.height || 600;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.setAnimationLoop(null);
      if (mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.clear();
    };
  }, []);

  // Reemplazar malla al cambiar selección o wireframe
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    if (currentMeshRef.current) {
      scene.remove(currentMeshRef.current);
      const mesh = currentMeshRef.current;
      if (mesh.geometry) mesh.geometry.dispose();
      if (mesh.material) {
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => m.dispose());
        } else {
          mesh.material.dispose();
        }
      }
    }

    const mesh = buildMeshFor(selectedGeometry);
    currentMeshRef.current = mesh;
    scene.add(mesh);
  }, [selectedGeometry, wireframe]);

  // Mostrar/ocultar helpers
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    const toRemove = [];
    scene.traverse((c) => {
      if (c.isAxesHelper || c.isGridHelper) toRemove.push(c);
    });
    toRemove.forEach((c) => scene.remove(c));
    if (showHelpers) {
      scene.add(
        new THREE.AxesHelper(2),
        new THREE.GridHelper(10, 10, 0x444444, 0x222222)
      );
    }
  }, [showHelpers]);

  return (
    <div
      ref={mountRef}
      style={{ width: "100%", height: "100%", position: "relative" }}
    >
      {/* Botones de geometrías */}
      <div
        style={{
          position: "absolute",
          left: 12,
          top: 12,
          display: "grid",
          gap: 6,
        }}
      >
        {Object.entries(geometries).map(([key, g]) => (
          <button
            key={key}
            onClick={() => setSelectedGeometry(key)}
            style={{
              opacity: selectedGeometry === key ? 1 : 0.7,
              fontWeight: selectedGeometry === key ? "bold" : "normal",
            }}
          >
            {g.name}
          </button>
        ))}
      </div>

      {/* Botones de control */}
      <div
        style={{
          position: "absolute",
          right: 12,
          top: 12,
          display: "grid",
          gap: 8,
        }}
      >
        <button onClick={() => setWireframe(!wireframe)}>
          {wireframe ? "🔲 Sólido" : "🔳 Wireframe"}
        </button>
      </div>
    </div>
  );
}
