"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import * as THREE from "three";

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
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.6;
    element.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    camera.position.z = 8.3;

    // Local studio reflections avoid a large external HDR download.
    const studio = document.createElement("canvas");
    studio.width = 1024;
    studio.height = 512;
    const paint = studio.getContext("2d")!;
    paint.fillStyle = "#171916";
    paint.fillRect(0, 0, 1024, 512);
    [
      { x: 100, w: 95, color: "#f6f7eb" },
      { x: 330, w: 220, color: "#e9eddd" },
      { x: 620, w: 70, color: "#c7f45b" },
      { x: 820, w: 160, color: "#f4f4ee" },
    ].forEach(({ x, w, color }) => {
      const gradient = paint.createLinearGradient(x, 0, x + w, 0);
      gradient.addColorStop(0, "#252822");
      gradient.addColorStop(0.28, color);
      gradient.addColorStop(0.72, color);
      gradient.addColorStop(1, "#252822");
      paint.fillStyle = gradient;
      paint.fillRect(x, 25, w, 440);
    });
    const environment = new THREE.CanvasTexture(studio);
    environment.mapping = THREE.EquirectangularReflectionMapping;
    environment.colorSpace = THREE.SRGBColorSpace;
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envMap = pmrem.fromEquirectangular(environment);
    scene.environment = envMap.texture;
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xd5ddbb,
      metalness: 1,
      roughness: 0.18,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      envMapIntensity: 1.7,
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
        float ripple = sin(position.y * 3.0 + uTime * 0.7) * cos(position.x * 2.0 - uTime * 0.4);
        transformed += normal * ripple * (0.045 + uProgress * 0.11);
      `,
      );
    };
    material.customProgramCacheKey = () => "portfolio-liquid-chrome";
    const form = new THREE.Mesh(
      new THREE.TorusKnotGeometry(1.32, 0.43, 180, 28, 2, 3),
      material,
    );
    form.rotation.set(0.3, -0.4, -0.4);
    scene.add(form);
    const light = new THREE.DirectionalLight(0xd6ff81, 4);
    light.position.set(-3, 4, 5);
    scene.add(light, new THREE.AmbientLight(0xffffff, 0.4));
    let inView = true;
    let frame = 0;
    let previous = 0;
    let elapsed = 0;
    const pointer = { x: 0, y: 0 };
    const smoothed = { x: 0, y: 0 };
    const render = () => renderer.render(scene, camera);
    const tick = (time: number) => {
      frame = 0;
      if (!inView || document.hidden || !animated) return;
      const delta = previous ? Math.min((time - previous) / 1000, 0.04) : 0;
      previous = time;
      elapsed += delta;
      const travel = progress.current?.value ?? 0;
      uniforms.uTime.value = elapsed;
      uniforms.uProgress.value = travel;
      camera.position.z = 8.3 - travel * 2.3;
      smoothed.x += (pointer.x - smoothed.x) * 0.04;
      smoothed.y += (pointer.y - smoothed.y) * 0.04;
      form.rotation.y =
        -0.4 + elapsed * 0.15 + smoothed.x * 0.35 + travel * 0.7;
      form.rotation.x =
        0.3 + Math.sin(elapsed * 0.22) * 0.2 + smoothed.y * 0.25;
      form.rotation.z = -0.4 + Math.sin(elapsed * 0.15) * 0.18;
      form.position.y = Math.sin(elapsed * 0.65) * 0.08;
      render();
      frame = requestAnimationFrame(tick);
    };
    const sync = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      previous = 0;
      if (inView && !document.hidden && animated)
        frame = requestAnimationFrame(tick);
    };
    const resize = () => {
      const { width, height } = element.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      render();
    };
    changeForm.current = (index) => {
      form.geometry.dispose();
      form.geometry =
        index % 3 === 1
          ? new THREE.TorusKnotGeometry(1.25, 0.34, 200, 28, 3, 4)
          : index % 3 === 2
            ? new THREE.TorusKnotGeometry(1.28, 0.3, 200, 28, 2, 5)
            : new THREE.TorusKnotGeometry(1.32, 0.43, 180, 28, 2, 3);
      render();
    };
    const onPointer = (event: PointerEvent) => {
      pointer.x = event.clientX / window.innerWidth - 0.5;
      pointer.y = event.clientY / window.innerHeight - 0.5;
    };
    const onLost = (event: Event) => {
      event.preventDefault();
      setReady(false);
      inView = false;
      sync();
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    observer.observe(element);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(element);
    document.addEventListener("visibilitychange", sync);
    if (animated)
      window.addEventListener("pointermove", onPointer, { passive: true });
    renderer.domElement.addEventListener("webglcontextlost", onLost);
    resize();
    setReady(true);
    sync();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("pointermove", onPointer);
      renderer.domElement.removeEventListener("webglcontextlost", onLost);
      changeForm.current = null;
      form.geometry.dispose();
      material.dispose();
      environment.dispose();
      envMap.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [animated, progress]);
  useEffect(() => {
    changeForm.current?.(variant);
  }, [variant, animated]);
  return (
    <div
      className={`sculpture-host ${ready ? "is-ready" : ""}`}
      ref={host}
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
