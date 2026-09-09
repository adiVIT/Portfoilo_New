"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import * as THREE from "three";

const TAU = Math.PI * 2;

/** A small, self-contained studio. No models, HDR downloads, or post-processing. */
export default function HeroSculpture({
  animated,
  variant,
  progress,
}: {
  animated: boolean;
  variant: number;
  progress: RefObject<{ value: number }>;
}) {
  const host = useRef<HTMLDivElement>(null);
  const changeForm = useRef<((variant: number) => void) | null>(null);
  const changeMotion = useRef<((enabled: boolean) => void) | null>(null);
  const initialVariant = useRef(variant);
  const initialMotion = useRef(animated);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    setReady(false);
    const compact = window.matchMedia("(max-width: 700px)").matches;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: !compact,
        powerPreference: "low-power",
      });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, compact ? 1.35 : 1.6));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    element.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(37, 1, 0.1, 60);
    const sculpture = new THREE.Group();
    scene.add(sculpture);

    // Tall softboxes and a theme-colored strip make legible, high-contrast chrome.
    const studio = document.createElement("canvas");
    studio.width = 1024;
    studio.height = 512;
    const paint = studio.getContext("2d");
    if (!paint) {
      renderer.dispose();
      renderer.domElement.remove();
      return;
    }
    const themeAccent = () => getComputedStyle(document.documentElement).getPropertyValue("--lime").trim() || "#d0f575";
    const paintStudio = () => {
    paint.fillStyle = "#080808";
    paint.fillRect(0, 0, 1024, 512);
    [
      { x: 70, w: 120, color: "#f8f8f8", top: 55, height: 390 },
      { x: 330, w: 230, color: "#ffffff", top: 15, height: 470 },
      { x: 620, w: 80, color: themeAccent(), top: 60, height: 350 },
      { x: 800, w: 155, color: "#d5d5d5", top: 110, height: 280 },
    ].forEach(({ x, w, color, top, height }) => {
      const gradient = paint.createLinearGradient(x, 0, x + w, 0);
      gradient.addColorStop(0, "#101010");
      gradient.addColorStop(0.15, color);
      gradient.addColorStop(0.85, color);
      gradient.addColorStop(1, "#101010");
      paint.fillStyle = gradient;
      paint.fillRect(x, top, w, height);
    });
    };
    paintStudio();
    const environment = new THREE.CanvasTexture(studio);
    environment.mapping = THREE.EquirectangularReflectionMapping;
    environment.colorSpace = THREE.SRGBColorSpace;
    const pmrem = new THREE.PMREMGenerator(renderer);
    let envMap = pmrem.fromEquirectangular(environment);
    scene.environment = envMap.texture;

    const material = new THREE.MeshPhysicalMaterial({
      color: 0xdce3d0,
      metalness: 1,
      roughness: 0.17,
      clearcoat: 1,
      clearcoatRoughness: 0.09,
      envMapIntensity: 1.6,
    });
    const uniforms = { uTime: { value: 0 }, uProgress: { value: 0 } };
    material.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = uniforms.uTime;
      shader.uniforms.uProgress = uniforms.uProgress;
      shader.vertexShader =
        "uniform float uTime; uniform float uProgress;\n" + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace(
        "#include <begin_vertex>",
        `
        vec3 transformed = vec3(position);
        float ripple = sin(position.y * 3.0 + uTime * 0.55)
          * cos(position.x * 2.0 - uTime * 0.35);
        transformed += normal * ripple * (0.035 + uProgress * 0.085);
        `,
      );
    };
    material.customProgramCacheKey = () => "portfolio-orbital-chrome-v2";

    const createForm = (index: number) => {
      const segments = compact ? 128 : 200;
      const radial = compact ? 18 : 28;
      switch (((index % 3) + 3) % 3) {
        case 1:
          return new THREE.TorusKnotGeometry(1.2, 0.3, segments, radial, 3, 4);
        case 2:
          return new THREE.TorusKnotGeometry(1.23, 0.29, segments, radial, 2, 5);
        default:
          return new THREE.TorusKnotGeometry(1.26, 0.4, segments, radial, 2, 3);
      }
    };
    const form = new THREE.Mesh(createForm(initialVariant.current), material);
    sculpture.add(form);

    // One draw call for the entire mechanical halo. Its numbered fins unfurl
    // into a helix as the camera enters the sculpture during the pinned scene.
    const halo = new THREE.Group();
    sculpture.add(halo);
    const finCount = compact ? 80 : 112;
    const finGeometry = new THREE.BoxGeometry(1, 1, 1);
    const finMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.82,
      roughness: 0.27,
      envMapIntensity: 1.5,
      emissive: 0xaac75d,
      emissiveIntensity: 0.035,
    });
    const fins = new THREE.InstancedMesh(finGeometry, finMaterial, finCount);
    fins.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    // Instances spread beyond their initial bounds; avoid a stale frustum sphere.
    fins.frustumCulled = false;
    const finColor = new THREE.Color();
    for (let i = 0; i < finCount; i++) {
      finColor.set(i % 14 < 4 ? 0xd2ff65 : i % 7 === 0 ? 0xffffff : 0x829075);
      fins.setColorAt(i, finColor);
    }
    halo.add(fins);
    const finTransform = new THREE.Object3D();

    const arcGeometry = new THREE.TorusGeometry(2.69, 0.006, 4, compact ? 96 : 160, Math.PI * 1.62);
    const arcMaterial = new THREE.MeshBasicMaterial({
      color: 0xc2d5a5,
      transparent: true,
      opacity: 0.28,
      depthWrite: false,
    });
    const arc = new THREE.Mesh(arcGeometry, arcMaterial);
    arc.rotation.z = 0.5;
    halo.add(arc);

    // Sparse points establish depth without covering the typography in a starfield.
    const pointCount = compact ? 20 : 34;
    const pointPositions = new Float32Array(pointCount * 3);
    for (let i = 0; i < pointCount; i++) {
      const angle = i * 2.399963;
      const radius = 3.1 + ((i * 37) % 13) / 7;
      pointPositions[i * 3] = Math.cos(angle) * radius;
      pointPositions[i * 3 + 1] = Math.sin(angle) * radius * 0.78;
      pointPositions[i * 3 + 2] = ((i * 17) % 29) / 3 - 6;
    }
    const pointGeometry = new THREE.BufferGeometry();
    pointGeometry.setAttribute("position", new THREE.BufferAttribute(pointPositions, 3));
    const pointMaterial = new THREE.PointsMaterial({
      color: 0xc9e798,
      size: compact ? 0.035 : 0.025,
      transparent: true,
      opacity: 0.43,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(pointGeometry, pointMaterial);
    scene.add(particles);

    const keyLight = new THREE.DirectionalLight(0xf1ffe4, 3.1);
    keyLight.position.set(-3, 4, 5);
    const edgeLight = new THREE.DirectionalLight(0xb8ed52, 1.3);
    edgeLight.position.set(4, -2, -3);
    scene.add(keyLight, edgeLight, new THREE.AmbientLight(0xffffff, 0.35));

    let motionEnabled = initialMotion.current;
    let inView = true;
    let contextLost = false;
    let frame = 0;
    let previous = 0;
    let elapsed = 0;
    let fitDistance = 10.1;
    let haloProgress = -1;
    let pointerId: number | null = null;
    let dragged = false;
    let suppressClick = false;
    let lastX = 0;
    let lastY = 0;
    let downX = 0;
    let downY = 0;
    let lastPointerTime = 0;
    const pointer = { x: 0, y: 0 };
    const smoothed = { x: 0, y: 0 };
    const rotation = { x: 0, y: 0, velocity: 0 };

    const updateHalo = (travel: number) => {
      if (Math.abs(travel - haloProgress) < 0.00005) return;
      haloProgress = travel;
      const opening = THREE.MathUtils.smoothstep(travel, 0.08, 0.96);
      for (let i = 0; i < finCount; i++) {
        const fraction = i / finCount;
        const angle = fraction * TAU + opening * fraction * 2.4;
        const radius = 2.5 + opening * (1.8 + Math.sin(angle * 2) * 0.25);
        finTransform.position.set(
          Math.cos(angle) * radius,
          Math.sin(angle) * radius,
          Math.sin(fraction * TAU * 3) * 0.06 + opening * (fraction - 0.5) * 14,
        );
        finTransform.rotation.set(opening * 0.35, 0.28 + opening * fraction, angle - Math.PI / 2);
        finTransform.scale.set(
          i % 7 === 0 ? 0.033 : 0.022,
          (i % 7 === 0 ? 0.3 : 0.17) * (1 + opening * 0.35),
          0.16 + opening * 0.12,
        );
        finTransform.updateMatrix();
        fins.setMatrixAt(i, finTransform.matrix);
      }
      fins.instanceMatrix.needsUpdate = true;
      arcMaterial.opacity = 0.28 * (1 - THREE.MathUtils.smoothstep(travel, 0.08, 0.46));
    };

    const render = (delta = 0) => {
      if (contextLost) return;
      const travel = motionEnabled ? THREE.MathUtils.clamp(progress.current?.value ?? 0, 0, 1) : 0;
      const smoothing = motionEnabled ? 1 - Math.exp(-delta * 5) : 1;
      smoothed.x += (pointer.x - smoothed.x) * smoothing;
      smoothed.y += (pointer.y - smoothed.y) * smoothing;
      if (pointerId === null && motionEnabled) {
        rotation.y += rotation.velocity * delta;
        rotation.velocity *= Math.exp(-delta * 5);
      }
      uniforms.uTime.value = elapsed;
      uniforms.uProgress.value = travel;
      camera.position.set(smoothed.x * 0.22, -smoothed.y * 0.15, fitDistance - travel * 5.5);
      camera.lookAt(0, 0, -travel * 0.45);
      sculpture.rotation.set(rotation.x * 0.35, rotation.y * 0.35, 0);
      form.rotation.set(
        0.32 + Math.sin(elapsed * 0.2) * 0.14 + rotation.x * 0.65 + travel * 0.9,
        -0.42 + elapsed * 0.13 + rotation.y * 0.65 + travel * 2.9,
        -0.38 + Math.sin(elapsed * 0.14) * 0.12 - travel * 0.6,
      );
      form.position.set(travel * travel * 3.25, Math.sin(elapsed * 0.6) * 0.045 - travel * travel * 1.1, -travel * 1.6);
      form.scale.setScalar(1 - travel * 0.37);
      halo.rotation.set(0.58 - travel * 0.75, -0.36 + travel * 0.12, -0.22 + elapsed * 0.025 + travel * 0.6);
      particles.rotation.y = elapsed * 0.018 + rotation.y * 0.1;
      particles.rotation.z = -travel * 0.2;
      pointMaterial.opacity = 0.32 + travel * 0.24;
      updateHalo(travel);
      renderer.render(scene, camera);
    };

    const tick = (time: number) => {
      frame = 0;
      if (!inView || document.hidden || !motionEnabled || contextLost) return;
      const delta = previous ? Math.min((time - previous) / 1000, 0.05) : 0;
      previous = time;
      elapsed += delta;
      render(delta);
      frame = requestAnimationFrame(tick);
    };
    const sync = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      previous = 0;
      if (inView && !document.hidden && !contextLost && motionEnabled) {
        frame = requestAnimationFrame(tick);
      }
    };
    const resize = () => {
      // CSS transforms animate ancestors. Layout dimensions keep the backing
      // buffer stable instead of resizing it during the camera choreography.
      const width = element.clientWidth;
      const height = element.clientHeight;
      if (!width || !height || contextLost) return;
      const pixelRatio = Math.min(window.devicePixelRatio, window.innerWidth <= 700 ? 1.35 : 1.6);
      if (renderer.getPixelRatio() !== pixelRatio) renderer.setPixelRatio(pixelRatio);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      fitDistance = 10.1 * Math.max(1, 0.94 / camera.aspect);
      camera.updateProjectionMatrix();
      render();
    };

    changeForm.current = (index) => {
      initialVariant.current = index;
      form.geometry.dispose();
      form.geometry = createForm(index);
      render();
    };
    changeMotion.current = (enabled) => {
      initialMotion.current = enabled;
      motionEnabled = enabled;
      rotation.velocity = 0;
      pointer.x = 0;
      pointer.y = 0;
      sync();
      render();
    };

    const onPointerDown = (event: PointerEvent) => {
      if (!event.isPrimary || (event.pointerType === "mouse" && event.button !== 0)) return;
      pointerId = event.pointerId;
      lastX = downX = event.clientX;
      lastY = downY = event.clientY;
      lastPointerTime = event.timeStamp;
      dragged = false;
      suppressClick = false;
      rotation.velocity = 0;
      element.setPointerCapture(event.pointerId);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerId === pointerId) {
        const dx = event.clientX - lastX;
        const dy = event.clientY - lastY;
        if (Math.hypot(event.clientX - downX, event.clientY - downY) > 7) dragged = true;
        if (dragged) {
          rotation.y += dx * 0.007;
          rotation.x = THREE.MathUtils.clamp(rotation.x + dy * 0.005, -1.25, 1.25);
          const dt = Math.max((event.timeStamp - lastPointerTime) / 1000, 0.008);
          rotation.velocity = THREE.MathUtils.clamp((dx * 0.007) / dt, -3, 3);
          element.style.cursor = "grabbing";
          if (!motionEnabled) render();
        }
        lastX = event.clientX;
        lastY = event.clientY;
        lastPointerTime = event.timeStamp;
      } else if (event.pointerType === "mouse" && motionEnabled) {
        const rect = element.getBoundingClientRect();
        pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
        pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      }
    };
    const onPointerUp = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) return;
      suppressClick = dragged;
      pointerId = null;
      if (element.hasPointerCapture(event.pointerId)) element.releasePointerCapture(event.pointerId);
      element.style.cursor = "grab";
    };
    const onPointerCancel = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) return;
      onPointerUp(event);
      rotation.velocity = 0;
      suppressClick = false;
    };
    const onPointerLeave = () => {
      pointer.x = 0;
      pointer.y = 0;
    };
    const onClick = (event: MouseEvent) => {
      if (!suppressClick) return;
      // A completed drag must not also activate the parent's tap-to-remix action.
      event.preventDefault();
      event.stopPropagation();
      suppressClick = false;
    };
    const onLost = (event: Event) => {
      event.preventDefault();
      contextLost = true;
      setReady(false);
      sync();
    };
    const onRestored = () => {
      contextLost = false;
      envMap.dispose();
      envMap = pmrem.fromEquirectangular(environment);
      scene.environment = envMap.texture;
      resize();
      setReady(true);
      sync();
    };
    const updateTheme = () => {
      const accent = new THREE.Color(themeAccent());
      material.color.set(0xe5e5e5).lerp(accent, .12);
      finMaterial.emissive.copy(accent);
      for (let i = 0; i < finCount; i++) {
        finColor.copy(accent).multiplyScalar(i % 14 < 4 ? 1 : .38);
        if (i % 7 === 0) finColor.set(0xffffff);
        fins.setColorAt(i, finColor);
      }
      if (fins.instanceColor) fins.instanceColor.needsUpdate = true;
      arcMaterial.color.copy(accent); pointMaterial.color.copy(accent); edgeLight.color.copy(accent);
      keyLight.color.set(0xffffff);
      paintStudio(); environment.needsUpdate = true;
      if (!contextLost) {
        envMap.dispose(); envMap = pmrem.fromEquirectangular(environment); scene.environment = envMap.texture;
        render();
      }
    };
    const themeObserver = new MutationObserver(updateTheme);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-music-theme"] });
    updateTheme();
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    observer.observe(element);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(element);
    document.addEventListener("visibilitychange", sync);
    element.addEventListener("pointerdown", onPointerDown);
    element.addEventListener("pointermove", onPointerMove, { passive: true });
    element.addEventListener("pointerup", onPointerUp);
    element.addEventListener("pointercancel", onPointerCancel);
    element.addEventListener("lostpointercapture", onPointerCancel);
    element.addEventListener("pointerleave", onPointerLeave);
    element.addEventListener("click", onClick, true);
    renderer.domElement.addEventListener("webglcontextlost", onLost);
    renderer.domElement.addEventListener("webglcontextrestored", onRestored);
    resize();
    setReady(true);
    sync();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      themeObserver.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", sync);
      element.removeEventListener("pointerdown", onPointerDown);
      element.removeEventListener("pointermove", onPointerMove);
      element.removeEventListener("pointerup", onPointerUp);
      element.removeEventListener("pointercancel", onPointerCancel);
      element.removeEventListener("lostpointercapture", onPointerCancel);
      element.removeEventListener("pointerleave", onPointerLeave);
      element.removeEventListener("click", onClick, true);
      renderer.domElement.removeEventListener("webglcontextlost", onLost);
      renderer.domElement.removeEventListener("webglcontextrestored", onRestored);
      changeForm.current = null;
      changeMotion.current = null;
      form.geometry.dispose();
      material.dispose();
      fins.dispose();
      finGeometry.dispose();
      finMaterial.dispose();
      arcGeometry.dispose();
      arcMaterial.dispose();
      pointGeometry.dispose();
      pointMaterial.dispose();
      environment.dispose();
      envMap.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [progress]);

  useEffect(() => {
    initialVariant.current = variant;
    changeForm.current?.(variant);
  }, [variant]);

  useEffect(() => {
    initialMotion.current = animated;
    changeMotion.current?.(animated);
  }, [animated]);

  return (
    <div
      className={`sculpture-host ${ready ? "is-ready" : ""}`}
      ref={host}
      style={{ touchAction: "pan-y", cursor: "grab" }}
      aria-hidden="true"
    >
      <div className="sculpture-fallback">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}
