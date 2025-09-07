// components/Prac4.jsx
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";

const Prac4 = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // --- Escena / cámara / renderer ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x202020);

    const sizes = {
      width: mountRef.current.clientWidth,
      height: mountRef.current.clientHeight,
    };

    const camera = new THREE.PerspectiveCamera(60, sizes.width / sizes.height, 0.1, 100);
    camera.position.set(5, 5, 8);
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);

    // --- Objetos base ---
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x808080, roughness: 0.8 });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(12, 12), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    const box = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 1.2, 1.2),
      new THREE.MeshStandardMaterial({ color: 0x44aa88, metalness: 0.3, roughness: 0.4 })
    );
    box.position.set(-1.8, 0.6, 0);
    box.castShadow = true;
    scene.add(box);

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.8, 32, 32),
      new THREE.MeshStandardMaterial({ color: 0xaa8844, metalness: 0.5, roughness: 0.3 })
    );
    sphere.position.set(1.8, 0.8, 0);
    sphere.castShadow = true;
    scene.add(sphere);

    // --- Luces (todas) ---
    RectAreaLightUniformsLib.init();

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 6, 4);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.set(1024, 1024);
    directionalLight.shadow.bias = -0.0005;
    scene.add(directionalLight);

    const hemisphereLight = new THREE.HemisphereLight(0x87ceeb, 0x444444, 0.5);
    scene.add(hemisphereLight);

    const pointLight = new THREE.PointLight(0xffaa00, 1.5, 20, 2);
    pointLight.position.set(2, 3, 2);
    pointLight.castShadow = true;
    scene.add(pointLight);

    const spotLight = new THREE.SpotLight(0xffffff, 1.2, 20, Math.PI / 6, 0.3);
    spotLight.position.set(-3, 6, 2);
    spotLight.castShadow = true;
    scene.add(spotLight);

    const rectAreaLight = new THREE.RectAreaLight(0xffffff, 5, 4, 2);
    rectAreaLight.position.set(-2, 3, -2);
    scene.add(rectAreaLight);

    // --- OrbitControls ---
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // --- GUI ---
    const gui = new GUI();
    const folderMain = gui.addFolder("Controls");

    // Ambient: intensidad + color
    folderMain.add(ambientLight, "intensity", 0, 3, 0.1).name("Ambient Intensity");
    folderMain
      .addColor({ color: ambientLight.color.getHex() }, "color")
      .name("Ambient Color")
      .onChange((v) => ambientLight.color.set(v));

    // Point: intensidad
    folderMain.add(pointLight, "intensity", 0, 5, 0.1).name("Point Intensity");

    // Switches de visibilidad
    const all = { ambientLight, directionalLight, hemisphereLight, pointLight, spotLight, rectAreaLight };
    const vis = {
      Ambient: true,
      Directional: true,
      Hemisphere: true,
      Point: true,
      Spot: true,
      Rect: true,
    };

    const folderVis = gui.addFolder("Lights ON/OFF");
    folderVis.add(vis, "Ambient").onChange((v) => (ambientLight.visible = v));
    folderVis.add(vis, "Directional").onChange((v) => (directionalLight.visible = v));
    folderVis.add(vis, "Hemisphere").onChange((v) => (hemisphereLight.visible = v));
    folderVis.add(vis, "Point").onChange((v) => (pointLight.visible = v));
    folderVis.add(vis, "Spot").onChange((v) => (spotLight.visible = v));
    folderVis.add(vis, "Rect").onChange((v) => (rectAreaLight.visible = v));

    // Botones "Solo esta luz"
    const folderSolo = gui.addFolder("Solo una luz");
    function solo(luz) {
      ambientLight.visible = directionalLight.visible = hemisphereLight.visible =
        pointLight.visible = spotLight.visible = rectAreaLight.visible = false;
      luz.visible = true;
    }
    folderSolo.add({ Ambient: () => solo(ambientLight) }, "Ambient");
    folderSolo.add({ Directional: () => solo(directionalLight) }, "Directional");
    folderSolo.add({ Hemisphere: () => solo(hemisphereLight) }, "Hemisphere");
    folderSolo.add({ Point: () => solo(pointLight) }, "Point");
    folderSolo.add({ Spot: () => solo(spotLight) }, "Spot");
    folderSolo.add({ Rect: () => solo(rectAreaLight) }, "Rect");

    // --- Resize ---
    const onResize = () => {
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener("resize", onResize);

    // --- Animación ---
    let raf;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      box.rotation.y += 0.005;
      sphere.rotation.y -= 0.004;
      controls.update();
      renderer.render(scene, camera);
    };
    tick();

    // --- Cleanup ---
    return () => {
      gui.destroy();
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
      if (mountRef.current && renderer.domElement.parentElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100%", height: "70vh" }} />;
};

export default Prac4;
