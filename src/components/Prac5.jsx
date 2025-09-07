import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

const Prac5 = () => {
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

    // --- Luces (reutilizamos esquema de Practica-4) ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight.position.set(5, 6, 4);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.set(1024, 1024);
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0xffaa00, 1.2, 20, 2);
    pointLight.position.set(-2, 3, 2);
    pointLight.castShadow = true;
    scene.add(pointLight);

    // --- Geometrías base ---
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(12, 12),
      new THREE.MeshStandardMaterial({ color: 0x808080, roughness: 0.8 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Materiales que usaremos en la comparación
    const standardMat = new THREE.MeshStandardMaterial({
      color: 0xaa8844,
      metalness: 0.4,
      roughness: 0.4,
    });

    const phongMat = new THREE.MeshPhongMaterial({
      color: 0xaa8844,
      shininess: 60,
      specular: new THREE.Color(0xffffff),
    });

    const lambertMat = new THREE.MeshLambertMaterial({
      color: 0xaa8844,
    });

    // Objetos (esfera + cubo) con "mismo material" seleccionable
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.9, 32, 32), standardMat);
    sphere.position.set(-1.8, 0.9, 0);
    sphere.castShadow = true;
    sphere.receiveShadow = false;
    scene.add(sphere);

    const cube = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 1.2), standardMat);
    cube.position.set(1.8, 0.6, 0);
    cube.castShadow = true;
    cube.receiveShadow = false;
    scene.add(cube);

    // --- Helpers (opcional) ---
    const axes = new THREE.AxesHelper(2);
    scene.add(axes);

    // --- OrbitControls ---
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // --- GUI: selector de material y propiedades ---
    const gui = new GUI({ title: "Practica-5 (Materiales)" });

    // Estado GUI
    const params = {
      materialType: "Standard", // "Standard" | "Phong" | "Lambert"
      color: "#aa8844",

      // Standard
      metalness: standardMat.metalness,
      roughness: standardMat.roughness,

      // Phong
      shininess: phongMat.shininess,
      specular: "#ffffff",
    };

    // Aplica el material seleccionado a ambos objetos
    function applyMaterial(type) {
      let mat = standardMat;
      if (type === "Phong") mat = phongMat;
      if (type === "Lambert") mat = lambertMat;

      // unifica color desde params
      mat.color.set(params.color);

      // setea en objetos
      sphere.material = mat;
      cube.material = mat;
      // para que Three.js actualice correctamente
      sphere.material.needsUpdate = true;
      cube.material.needsUpdate = true;
    }

    // Carpetas GUI
    const fMat = gui.addFolder("Material");
    fMat.add(params, "materialType", ["Standard", "Phong", "Lambert"])
      .name("Tipo")
      .onChange((v) => {
        applyMaterial(v);
        updateVisibility(); // alterna controles visibles según material
      });

    fMat.addColor(params, "color")
      .name("Color")
      .onChange((v) => {
        sphere.material.color.set(v);
        cube.material.color.set(v);
      });

    const fStd = gui.addFolder("Standard (PBR)");
    const metalCtrl = fStd.add(params, "metalness", 0, 1, 0.01).name("metalness").onChange((v) => {
      if (sphere.material instanceof THREE.MeshStandardMaterial) {
        sphere.material.metalness = v;
        cube.material.metalness = v;
      }
    });
    const roughCtrl = fStd.add(params, "roughness", 0, 1, 0.01).name("roughness").onChange((v) => {
      if (sphere.material instanceof THREE.MeshStandardMaterial) {
        sphere.material.roughness = v;
        cube.material.roughness = v;
      }
    });

    const fPhong = gui.addFolder("Phong");
    const shinCtrl = fPhong.add(params, "shininess", 0, 200, 1).name("shininess").onChange((v) => {
      if (sphere.material instanceof THREE.MeshPhongMaterial) {
        sphere.material.shininess = v;
        cube.material.shininess = v;
      }
    });
    const specCtrl = fPhong.addColor(params, "specular").name("specular").onChange((v) => {
      if (sphere.material instanceof THREE.MeshPhongMaterial) {
        sphere.material.specular.set(v);
        cube.material.specular.set(v);
      }
    });

    // Luces básicas en GUI (para mover rápido)
    const fLight = gui.addFolder("Luces");
    fLight.add(ambientLight, "intensity", 0, 3, 0.1).name("Ambient Intensity");
    fLight.add(dirLight, "intensity", 0, 3, 0.1).name("Directional Intensity");
    fLight.add(pointLight, "intensity", 0, 5, 0.1).name("Point Intensity");
    fLight.add(pointLight.position, "x", -5, 5, 0.1).name("Point X");
    fLight.add(pointLight.position, "y", 0, 6, 0.1).name("Point Y");
    fLight.add(pointLight.position, "z", -5, 5, 0.1).name("Point Z");

    // Control de visibilidad de carpetas según material
    function updateVisibility() {
      const isStd = params.materialType === "Standard";
      const isPhong = params.materialType === "Phong";
      fStd.domElement.parentElement.style.display = isStd ? "block" : "none";
      fPhong.domElement.parentElement.style.display = isPhong ? "block" : "none";
    }
    applyMaterial(params.materialType);
    updateVisibility();

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
      sphere.rotation.y += 0.006;
      cube.rotation.y -= 0.005;
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

export default Prac5;
