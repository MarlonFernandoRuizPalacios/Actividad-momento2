import React, { useEffect, useRef } from "react";

// ====== R3F / drei (para el modo R3F) ======
import { Canvas, useFrame, useLoader as useLoaderR3F } from "@react-three/fiber";
import { OrbitControls as OrbitControlsR3F, useGLTF } from "@react-three/drei";

// ====== Three.js puro (tu modo actual) ======
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import GUI from "lil-gui";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";

// ---------- Subcomponente para el modo R3F ----------
function RobotR3F() {
  const { scene } = useGLTF("/assets/RobotExpressive.glb");
  scene.traverse((c) => {
    if (c.isMesh) { c.castShadow = true; c.receiveShadow = true; }
  });
  scene.position.set(0.5, -0.7, -1);
  scene.scale.set(0.3, 0.3, 0.3);
  return <primitive object={scene} />;
}

function SceneR3F() {
  const sphere = useRef(null);
  const cube = useRef(null);
  const torus = useRef(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    [sphere.current, cube.current, torus.current].forEach((m) => {
      if (!m) return;
      m.rotation.y = 0.1 * t;
      m.rotation.x = 0.15 * t;
    });
  });

  return (
    <>
      {/* === Luces equivalentes en R3F === */}
      <ambientLight color={"#ffffff"} intensity={0.5} />
      <directionalLight color={"#ffcc00"} intensity={0.7} position={[1, 1, 1]} castShadow />
      <hemisphereLight args={[0x0000ff, 0xff0000, 0.6]} />
      <pointLight color={0xff9000} intensity={1} distance={10} decay={2} position={[0, 1, 1]} castShadow />
      <spotLight color={0x78ff00} intensity={2} distance={10} angle={Math.PI * 0.1} penumbra={0.25} position={[0, 2, 3]} castShadow />
      <rectAreaLight color={0x4e00ff} intensity={5} width={3} height={3} position={[-1.5, 0, 1.5]} />

      {/* === Objetos === */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.65, 0]} receiveShadow>
        <planeGeometry args={[5, 5]} />
        <meshStandardMaterial roughness={0.4} />
      </mesh>

      <mesh ref={sphere} position={[-1.5, 0.5, 0]} castShadow>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial roughness={0.4} />
      </mesh>

      <mesh ref={cube} position={[0, 0.375, 0]} castShadow>
        <boxGeometry args={[0.75, 0.75, 0.75]} />
        <meshStandardMaterial roughness={0.4} />
      </mesh>

      <mesh ref={torus} position={[1.5, 0.5, 0]} castShadow>
        <torusGeometry args={[0.3, 0.2, 32, 64]} />
        <meshStandardMaterial roughness={0.4} />
      </mesh>

      <RobotR3F />
      <OrbitControlsR3F />
    </>
  );
}

// ---------- Componente principal con dos modos ----------
const Prac3 = ({ useR3F = false }) => {
  // === MODO R3F (para el punto 3) ===
  if (useR3F) {
    return (
      <div style={{ width: "100%", height: "100%" }}>
        <Canvas camera={{ position: [5, 5, 8], fov: 60 }} shadows>
          <SceneR3F />
        </Canvas>
      </div>
    );
  }

  // === MODO THREE.JS PURO (tu código original, para evidencias previas) ===
  const mountRef = useRef(null);
  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();

    const sizes = { width: mountRef.current.clientWidth, height: mountRef.current.clientHeight };
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
    camera.position.set(1, 1, 2);
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);

    // Modelo
    const loader = new GLTFLoader();
    loader.load("/assets/RobotExpressive.glb", (gltf) => {
      const model = gltf.scene;
      model.traverse((c) => { if (c.isMesh) { c.castShadow = true; c.receiveShadow = true; } });
      model.position.set(0.5, -0.7, -1);
      model.scale.set(0.3, 0.3, 0.3);
      scene.add(model);
    });

    // Luces
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffcc00, 0.7);
    directionalLight.position.set(1, 1, 1);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const hemisphereLight = new THREE.HemisphereLight(0x0000ff, 0xff0000, 0.6);
    scene.add(hemisphereLight);

    const pointLight = new THREE.PointLight(0xff9000, 1, 10, 2);
    pointLight.position.set(0, 1, 1);
    pointLight.castShadow = true;
    scene.add(pointLight);

    const spotLight = new THREE.SpotLight(0x78ff00, 2, 10, Math.PI * 0.1, 0.25, 1);
    spotLight.position.set(0, 2, 3);
    spotLight.castShadow = true;
    scene.add(spotLight);

    RectAreaLightUniformsLib.init();
    const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 5, 3, 3);
    rectAreaLight.position.set(-1.5, 0, 1.5);
    scene.add(rectAreaLight);

    // Helpers
    const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2);
    scene.add(hemisphereLightHelper);
    const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2);
    scene.add(directionalLightHelper);
    const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
    scene.add(pointLightHelper);
    const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
    scene.add(rectAreaLightHelper);

    // Objetos
    const material = new THREE.MeshStandardMaterial({ roughness: 0.4 });
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
    sphere.position.x = -1.5;
    const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);
    const torus = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.2, 32, 64), material);
    torus.position.x = 1.5;
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
    plane.rotation.x = -Math.PI * 0.5;
    plane.position.y = -0.65;
    plane.receiveShadow = true;
    [sphere, cube, torus].forEach((m) => (m.castShadow = true));
    scene.add(sphere, cube, torus, plane);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // GUI mínima (como ya tenías)
    const gui = new GUI();
    gui.add(ambientLight, "intensity", 0, 3, 0.1).name("Ambient Intensity");
    gui.addColor({ color: ambientLight.color.getHex() }, "color")
      .name("Ambient Color")
      .onChange((v) => ambientLight.color.set(v));
    gui.add(pointLight, "intensity", 0, 5, 0.1).name("Point Intensity");

    const onResize = () => {
      const w = mountRef.current.clientWidth, h = mountRef.current.clientHeight;
      camera.aspect = w / h; camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();
    let raf;
    const tick = () => {
      const t = clock.getElapsedTime();
      sphere.rotation.y = cube.rotation.y = torus.rotation.y = 0.1 * t;
      sphere.rotation.x = cube.rotation.x = torus.rotation.x = 0.15 * t;
      controls.update();
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      gui.destroy();
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
      mountRef.current && mountRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />;
};

export default Prac3;
