"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import { knightRoute } from "./hobby-world-data";

type Inputs = { scene: number; action: number; animated: boolean };
const ease = (value: number) => 1 - (1 - Math.min(1, Math.max(0, value))) ** 3;

export default function HobbyWorld({ animated, scene, action, progress }: Inputs & {
  progress: RefObject<{ value: number }>;
}) {
  const host = useRef<HTMLDivElement>(null);
  const controls = useRef<((input: Inputs) => void) | null>(null);
  const initial = useRef({ scene, action, animated });
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
    } catch { setFailed(true); return; }
    const compact = matchMedia("(max-width: 700px)").matches;
    renderer.setPixelRatio(Math.min(devicePixelRatio, compact ? 1.25 : 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.domElement.setAttribute("aria-hidden", "true");
    element.appendChild(renderer.domElement);

    const world = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-5, 5, 2.8, -2.8, .1, 60);
    camera.position.set(6.6, 5, 9);
    camera.lookAt(0, .7, 0);
    world.add(new THREE.HemisphereLight(0xffffff, 0x545a4a, 2.6));
    const key = new THREE.DirectionalLight(0xffffff, 4.2);
    key.position.set(-3, 7, 5); key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    Object.assign(key.shadow.camera, { left: -5, right: 5, top: 5, bottom: -5, near: .5, far: 20 });
    key.shadow.bias = -.001; key.shadow.normalBias = .035;
    world.add(key);
    const rim = new THREE.DirectionalLight(0xe2edff, 2); rim.position.set(4, 3, -3); world.add(rim);

    const studio = document.createElement("canvas"); studio.width = 512; studio.height = 256;
    const paint = studio.getContext("2d");
    if (!paint) { renderer.dispose(); renderer.domElement.remove(); setFailed(true); return; }
    paint.fillStyle = "#44483e"; paint.fillRect(0, 0, 512, 256);
    paint.fillStyle = "#ffffff"; paint.fillRect(60, 12, 110, 230); paint.fillRect(330, 40, 65, 175);
    paint.fillStyle = "#b2bda4"; paint.fillRect(235, 0, 30, 256);
    const environment = new THREE.CanvasTexture(studio); environment.mapping = THREE.EquirectangularReflectionMapping; environment.colorSpace = THREE.SRGBColorSpace;
    const pmrem = new THREE.PMREMGenerator(renderer);
    let envMap = pmrem.fromEquirectangular(environment); world.environment = envMap.texture;

    const geometries = new Set<THREE.BufferGeometry>();
    const materials = new Set<THREE.Material>();
    const material = (color: number, metalness = .1, roughness = .36) => {
      const value = new THREE.MeshStandardMaterial({ color, metalness, roughness }); materials.add(value); return value;
    };
    const ivory = material(0xf6f3e9, .2, .3);
    const chrome = material(0xbfc4c2, .94, .16);
    const black = material(0x222720, .35, .34);
    const green = material(0x47633e, .22, .5);
    const lavender = material(0x8c76b0, .25, .35);
    const blue = material(0x78aec8, .35, .25);
    const orange = material(0xc96331, .3, .3);
    const mesh = (geometry: THREE.BufferGeometry, mat: THREE.Material, parent: THREE.Object3D, x = 0, y = 0, z = 0) => {
      geometries.add(geometry); const object = new THREE.Mesh(geometry, mat); object.position.set(x, y, z); object.castShadow = true; object.receiveShadow = true; parent.add(object); return object;
    };
    const box = (parent: THREE.Object3D, w: number, h: number, d: number, mat: THREE.Material, x = 0, y = 0, z = 0) => mesh(new THREE.BoxGeometry(w, h, d), mat, parent, x, y, z);
    const cylinder = (parent: THREE.Object3D, rt: number, rb: number, h: number, mat: THREE.Material, x = 0, y = 0, z = 0) => mesh(new THREE.CylinderGeometry(rt, rb, h, 40), mat, parent, x, y, z);
    const rod = (parent: THREE.Object3D, a: number[], b: number[], radius: number, mat: THREE.Material) => {
      const start = new THREE.Vector3(...a), end = new THREE.Vector3(...b);
      const object = cylinder(parent, radius, radius, start.distanceTo(end), mat);
      object.position.copy(start).lerp(end, .5); object.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), end.sub(start).normalize()); return object;
    };
    const groups = Array.from({ length: 4 }, () => { const group = new THREE.Group(); world.add(group); return group; });

    // Truncate the icosahedron into 20 hexagons and 12 pentagons: an actual football panel pattern.
    const football = new THREE.Group(); groups[0].add(football);
    const ico = new THREE.IcosahedronGeometry(1, 0); const positions = ico.getAttribute("position");
    const vertices: THREE.Vector3[] = []; const faces: number[][] = [];
    for (let i = 0; i < positions.count; i += 3) {
      const face: number[] = [];
      for (let j = 0; j < 3; j++) {
        const point = new THREE.Vector3().fromBufferAttribute(positions, i + j);
        let index = vertices.findIndex((v) => v.distanceToSquared(point) < .00001);
        if (index === -1) { index = vertices.length; vertices.push(point); }
        face.push(index);
      }
      faces.push(face);
    }
    ico.dispose();
    const panel = (points: THREE.Vector3[], mat: THREE.Material) => {
      const scaled = points.map((point) => point.clone().normalize().multiplyScalar(1.05));
      const center = scaled.reduce((sum, point) => sum.add(point), new THREE.Vector3()).divideScalar(scaled.length);
      const normal = center.clone().normalize();
      const tangent = scaled[0].clone().sub(center).normalize(); const bitangent = normal.clone().cross(tangent);
      scaled.sort((a, b) => Math.atan2(a.clone().sub(center).dot(bitangent), a.clone().sub(center).dot(tangent)) - Math.atan2(b.clone().sub(center).dot(bitangent), b.clone().sub(center).dot(tangent)));
      scaled.forEach((point) => point.sub(center).multiplyScalar(.975).add(center));
      const data: number[] = [];
      for (let i = 0; i < scaled.length; i++) data.push(...center.toArray(), ...scaled[i].toArray(), ...scaled[(i + 1) % scaled.length].toArray());
      const geometry = new THREE.BufferGeometry(); geometry.setAttribute("position", new THREE.Float32BufferAttribute(data, 3)); geometry.computeVertexNormals();
      mesh(geometry, mat, football);
    };
    faces.forEach(([a, b, c]) => panel([
      vertices[a].clone().lerp(vertices[b], 1 / 3), vertices[a].clone().lerp(vertices[b], 2 / 3),
      vertices[b].clone().lerp(vertices[c], 1 / 3), vertices[b].clone().lerp(vertices[c], 2 / 3),
      vertices[c].clone().lerp(vertices[a], 1 / 3), vertices[c].clone().lerp(vertices[a], 2 / 3),
    ], ivory));
    vertices.forEach((vertex, index) => {
      const neighbours = new Set<number>(); faces.filter((face) => face.includes(index)).forEach((face) => face.forEach((v) => { if (v !== index) neighbours.add(v); }));
      panel([...neighbours].map((v) => vertex.clone().lerp(vertices[v], 1 / 3)), black);
    });
    mesh(new THREE.SphereGeometry(.9, 24, 16), black, football);
    box(groups[0], 5.2, .16, 3.4, green, 0, -.12, -.25);
    box(groups[0], 5.24, .05, 3.44, chrome, 0, -.22, -.25);
    const goal = new THREE.Group(); goal.position.set(1.1, 0, -1.22); groups[0].add(goal);
    rod(goal, [-1.04, 0, 0], [-1.04, 1.7, 0], .055, ivory); rod(goal, [1.04, 0, 0], [1.04, 1.7, 0], .055, ivory); rod(goal, [-1.04, 1.7, 0], [1.04, 1.7, 0], .055, ivory);
    rod(goal, [-1.04, 1.7, 0], [-1.04, .04, -.62], .025, chrome); rod(goal, [1.04, 1.7, 0], [1.04, .04, -.62], .025, chrome);
    const netMaterial = material(0xe4e8d8, .05, .8);
    for (let i = 0; i <= 8; i++) rod(goal, [-1.04 + i * .26, 1.68, -.035], [-1.04 + i * .26, .02, -.6], .009, netMaterial);
    for (let i = 0; i <= 6; i++) rod(goal, [-1.04, i * .28, -.6 + i * .094], [1.04, i * .28, -.6 + i * .094], .009, netMaterial);
    const fieldLine = box(groups[0], 4.8, .012, .024, ivory, 0, -.03, 1.14); fieldLine.castShadow = false;
    const ballStart = new THREE.Vector3(-.9, 1.05, .4), ballEnd = new THREE.Vector3(1.15, .57, -1.15);

    // A beveled horse profile gives the knight its familiar silhouette from both sides.
    box(groups[1], 3.8, .19, 3.8, chrome, 0, -.17, 0);
    const squareGeometry = new THREE.BoxGeometry(.445, .055, .445); geometries.add(squareGeometry);
    const squares = new THREE.InstancedMesh(squareGeometry, ivory, 64); groups[1].add(squares); squares.receiveShadow = true;
    const dummy = new THREE.Object3D();
    for (let rank = 0; rank < 8; rank++) for (let file = 0; file < 8; file++) {
      const i = rank * 8 + file; dummy.position.set((file - 3.5) * .445, -.035, (rank - 3.5) * .445); dummy.updateMatrix(); squares.setMatrixAt(i, dummy.matrix); squares.setColorAt(i, new THREE.Color((rank + file) % 2 ? 0x5b4b72 : 0xf0e8ef));
    }
    const knight = new THREE.Group(); groups[1].add(knight);
    cylinder(knight, .19, .24, .1, black, 0, .05);
    cylinder(knight, .12, .17, .15, chrome, 0, .16);
    const horse = new THREE.Shape();
    const profile = [[-.32, 0], [.3, 0], [.22, .48], [.4, .74], [.65, .82], [.67, 1.05], [.23, 1.32], [.02, 1.67], [-.11, 1.42], [-.28, 1.4], [-.57, .94], [-.4, .5]];
    profile.forEach(([x, y], i) => i ? horse.lineTo(x, y) : horse.moveTo(x, y)); horse.closePath();
    const horseMesh = mesh(new THREE.ExtrudeGeometry(horse, { depth: .27, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: .065, bevelThickness: .065 }), lavender, knight, 0, .23, -.135);
    horseMesh.scale.setScalar(.58);
    [-.16, .16].forEach((z) => mesh(new THREE.SphereGeometry(.025, 12, 8), black, knight, .15, .87, z));
    const pawn = (x: number, z: number) => {
      cylinder(groups[1], .14, .18, .08, ivory, x, .06, z); cylinder(groups[1], .07, .13, .29, ivory, x, .23, z); mesh(new THREE.SphereGeometry(.11, 24, 16), ivory, groups[1], x, .44, z);
    };
    pawn(-1.5575, 1.5575); pawn(1.5575, -1.5575);
    const marker = box(groups[1], .43, .018, .43, lavender, 0, .007, 0); marker.castShadow = false;
    const knightPosition = (count: number) => {
      const [x, z] = knightRoute[((count % knightRoute.length) + knightRoute.length) % knightRoute.length]; return new THREE.Vector3((x - 3.5) * .445, .04, (z - 3.5) * .445);
    };

    const assembly = new THREE.Group(); groups[2].add(assembly); assembly.rotation.set(.13, -.35, .08); assembly.position.y = .9;
    const blockShape = new THREE.Shape(); blockShape.moveTo(-.26, -.26); blockShape.lineTo(.26, -.26); blockShape.lineTo(.26, .26); blockShape.lineTo(-.26, .26); blockShape.closePath();
    const blockGeometry = new THREE.ExtrudeGeometry(blockShape, { depth: .52, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: .055, bevelThickness: .055 }); blockGeometry.translate(0, 0, -.26);
    const blocks: { mesh: THREE.Mesh; home: THREE.Vector3 }[] = [];
    for (let x = -1; x <= 1; x++) for (let y = -1; y <= 1; y++) for (let z = -1; z <= 1; z++) {
      const home = new THREE.Vector3(x * .69, y * .69, z * .69);
      const object = mesh(blockGeometry, (x + y + z) % 3 === 0 ? blue : (x + z) % 2 === 0 ? chrome : ivory, assembly); blocks.push({ mesh: object, home });
    }
    const orbit = mesh(new THREE.TorusGeometry(2.0, .018, 8, 100), chrome, groups[2], 0, .8, 0); orbit.rotation.x = 1.07; orbit.rotation.z = -.4;
    cylinder(groups[2], 1.62, 1.68, .12, blue, 0, -.42);

    const rocket = new THREE.Group(); groups[3].add(rocket);
    cylinder(rocket, .39, .39, 1.6, ivory, 0, 1.28);
    mesh(new THREE.ConeGeometry(.39, .78, 48), orange, rocket, 0, 2.47);
    cylinder(rocket, .4, .4, .13, chrome, 0, .52);
    cylinder(rocket, .2, .3, .25, black, 0, .34);
    const glass = material(0x193d4b, .75, .14);
    mesh(new THREE.TorusGeometry(.19, .05, 12, 40), chrome, rocket, 0, 1.6, .38);
    mesh(new THREE.CircleGeometry(.18, 40), glass, rocket, 0, 1.6, .398);
    for (let i = 0; i < 3; i++) {
      const finShape = new THREE.Shape(); finShape.moveTo(0, 0); finShape.lineTo(.67, -.35); finShape.lineTo(.58, .45); finShape.lineTo(0, .78); finShape.closePath();
      const fin = mesh(new THREE.ExtrudeGeometry(finShape, { depth: .09, bevelEnabled: true, bevelSegments: 2, bevelSize: .025, bevelThickness: .025 }), orange, rocket); fin.position.y = .58; fin.rotation.y = i * Math.PI * 2 / 3;
    }
    const flameMaterial = new THREE.MeshBasicMaterial({ color: 0xffd173 }); materials.add(flameMaterial);
    const flame = mesh(new THREE.ConeGeometry(.19, .85, 24), flameMaterial, rocket, 0, -.2); flame.rotation.z = Math.PI;
    cylinder(groups[3], 1.35, 1.5, .14, black, 0, -.15); cylinder(groups[3], 1.39, 1.43, .055, chrome, 0, -.05);
    const launchRing = mesh(new THREE.TorusGeometry(1.08, .018, 8, 80), orange, groups[3], 0, -.013); launchRing.rotation.x = Math.PI / 2;
    rocket.rotation.z = -.12;

    let input = initial.current; let current = input.scene; let previous = -1;
    let sceneStart = -100; let actionStart = -100; let explosion = input.scene === 2 && input.action % 2 ? 1 : 0;
    let frame = 0; let disposed = false; let visible = false; let lost = false;
    let pointerX = 0, pointerY = 0, smoothX = 0, smoothY = 0;
    const render = (now: number) => {
      frame = 0;
      if (disposed || lost || !visible || document.hidden) return;
      const time = now / 1000; const transition = input.animated ? ease((time - sceneStart) / .72) : 1;
      smoothX += (pointerX - smoothX) * .06; smoothY += (pointerY - smoothY) * .06;
      groups.forEach((group, i) => {
        group.visible = i === current || (i === previous && transition < 1);
        if (!group.visible) return;
        const amount = i === current ? transition : 1 - transition;
        group.position.x = (i === current ? 1 : -1) * (1 - amount) * 4;
        group.scale.setScalar(.78 + .22 * amount);
        group.rotation.y = (i === current ? 1 : -1) * (1 - amount) * .65 + (input.animated ? smoothX * .13 : 0);
        group.rotation.x = input.animated ? smoothY * .04 : 0;
      });
      const elapsed = time - actionStart;
      const shot = input.action > 0 && current === 0 && elapsed < 2.1;
      const shotProgress = input.animated ? ease(elapsed / 1.1) : 1;
      football.position.copy(ballStart);
      football.scale.setScalar(1);
      if (current === 0 && input.action && (!input.animated || shot)) {
        football.position.lerp(ballEnd, shotProgress); football.position.y += Math.sin(shotProgress * Math.PI) * 1.35;
        football.scale.setScalar(1 - shotProgress * .53);
      } else if (input.animated) football.position.y += Math.sin(time * 1.4) * .045;
      football.rotation.set(.22, input.animated ? time * .16 + (shot ? elapsed * 3 : 0) : .3, .2);
      const destination = knightPosition(input.scene === 1 ? input.action : 0);
      if (current === 1 && input.animated && input.action > 0 && elapsed < .7) {
        const p = ease(elapsed / .7); knight.position.copy(knightPosition(input.action - 1)).lerp(destination, p); knight.position.y += Math.sin(p * Math.PI) * .8;
      } else knight.position.copy(destination);
      marker.position.set(destination.x, .007, destination.z);
      const targetExplosion = current === 2 && input.action % 2 ? 1 : 0;
      explosion = input.animated ? THREE.MathUtils.lerp(explosion, targetExplosion, .08) : targetExplosion;
      blocks.forEach(({ mesh: object, home }) => {
        object.position.copy(home).multiplyScalar(1 + explosion * .65);
        object.rotation.set(explosion * home.y * .4, explosion * home.x * .45, explosion * home.z * .35);
      });
      assembly.rotation.y = -.35 + (input.animated ? Math.sin(time * .35) * .16 : 0);
      const launching = current === 3 && input.action > 0 && elapsed < 2.7;
      rocket.position.set(0, input.animated ? Math.sin(time * 1.7) * .045 : 0, 0);
      flame.visible = launching || (!input.animated && current === 3 && input.action > 0);
      if (launching && input.animated) {
        const p = Math.min(elapsed / 1.7, 1); rocket.position.y += p * p * 6;
        if (elapsed > 2) rocket.position.y = 6 * (1 - ease((elapsed - 2) / .7));
        flame.scale.y = 1 + Math.sin(time * 36) * .14;
      } else if (!input.animated && current === 3 && input.action) rocket.position.y = 1.05;
      const drift = input.animated ? ((progress.current?.value ?? 0) * 4 % 1 - .3) * .1 : 0;
      camera.position.x = 6.6 + drift; camera.lookAt(0, .7, 0);
      renderer.render(world, camera);
      if (input.animated) frame = requestAnimationFrame(render);
    };
    const request = () => {
      // Pinning can move the canvas before IntersectionObserver delivers its next entry.
      // Refresh visibility on explicit interactions and resizes so a scene never stays stale.
      const bounds = element.getBoundingClientRect();
      visible = bounds.bottom > -100 && bounds.top < innerHeight + 100 && bounds.width > 0;
      if (!frame && visible && !document.hidden && !lost) frame = requestAnimationFrame(render);
    };
    controls.current = (next) => {
      const now = performance.now() / 1000;
      if (next.scene !== current) { previous = current; current = next.scene; sceneStart = now; actionStart = -100; }
      else if (next.action !== input.action) actionStart = now;
      input = next; request();
    };
    const resize = () => {
      const { width, height } = element.getBoundingClientRect();
      if (!width || !height) return;
      const aspect = width / height;
      const mobile = matchMedia("(max-width: 640px)").matches;
      const half = mobile ? Math.max(2.8, 3.4 / aspect) : Math.max(2.45, 2.9 / aspect);
      camera.left = -half * aspect; camera.right = half * aspect; camera.top = half; camera.bottom = -half; camera.updateProjectionMatrix();
      renderer.setSize(width, height, false); request();
    };
    const updateTheme = () => {
      const accent = new THREE.Color(getComputedStyle(document.documentElement).getPropertyValue("--lime").trim() || "#d0f575");
      lavender.color.copy(accent).multiplyScalar(.65);
      blue.color.copy(accent).multiplyScalar(.8);
      orange.color.copy(accent).multiplyScalar(.7);
      request();
    };
    const themeObserver = new MutationObserver(updateTheme);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-music-theme"] });
    updateTheme();
    const observer = new ResizeObserver(resize); observer.observe(element); resize();
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting; if (visible) request(); else { cancelAnimationFrame(frame); frame = 0; }
    }, { rootMargin: "100px" }); intersection.observe(element);
    const visibility = () => { if (document.hidden) { cancelAnimationFrame(frame); frame = 0; } else request(); };
    const pointer = (event: PointerEvent) => {
      if (!input.animated || event.pointerType === "touch") return;
      const rect = element.getBoundingClientRect(); pointerX = (event.clientX - rect.left) / rect.width * 2 - 1; pointerY = (event.clientY - rect.top) / rect.height * 2 - 1;
    };
    const leave = () => { pointerX = 0; pointerY = 0; };
    const contextLost = (event: Event) => { event.preventDefault(); lost = true; cancelAnimationFrame(frame); frame = 0; setFailed(true); setReady(false); };
    const contextRestored = () => {
      lost = false; envMap.dispose(); envMap = pmrem.fromEquirectangular(environment); world.environment = envMap.texture;
      setFailed(false); setReady(true); resize(); request();
    };
    element.addEventListener("pointermove", pointer, { passive: true }); element.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", visibility);
    renderer.domElement.addEventListener("webglcontextlost", contextLost); renderer.domElement.addEventListener("webglcontextrestored", contextRestored);
    setReady(true);
    return () => {
      disposed = true; controls.current = null; cancelAnimationFrame(frame); observer.disconnect(); intersection.disconnect(); themeObserver.disconnect();
      document.removeEventListener("visibilitychange", visibility); element.removeEventListener("pointermove", pointer); element.removeEventListener("pointerleave", leave);
      renderer.domElement.removeEventListener("webglcontextlost", contextLost); renderer.domElement.removeEventListener("webglcontextrestored", contextRestored);
      geometries.forEach((geometry) => geometry.dispose()); materials.forEach((mat) => mat.dispose());
      squares.dispose(); envMap.dispose(); environment.dispose(); pmrem.dispose(); key.shadow.map?.dispose();
      renderer.dispose(); renderer.domElement.remove();
    };
  }, [progress]);

  useEffect(() => { controls.current?.({ animated, scene, action }); }, [animated, scene, action]);

  return <div ref={host} className="hobby-world" data-ready={ready} data-action={action} data-scene={scene} aria-hidden="true">
    {(!ready || failed) && <div className="hobby-loading-object"><i /><i /><i /></div>}
  </div>;
}
