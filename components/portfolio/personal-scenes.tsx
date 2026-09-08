"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

const scenes = [
  { name: "Football", title: "One more game.", line: "You’ll find me on the pitch." },
  { name: "Chess", title: "Your move.", line: "A quiet board. A hundred possibilities." },
  { name: "Coding", title: "What if it worked?", line: "Some ideas are too interesting to leave alone." },
  { name: "Hackathon", title: "Let’s make something.", line: "A team, a ticking clock, and an idea." },
];

// Original silhouette drawings are sampled into a field of luminous dots.
function drawScene(ctx: CanvasRenderingContext2D, scene: number, time: number) {
  ctx.clearRect(0, 0, 560, 340);
  ctx.fillStyle = "white";
  ctx.strokeStyle = "white";
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  const path = (points: number[][], width = 14, alpha = 1) => {
    ctx.globalAlpha = alpha;
    ctx.lineWidth = width;
    ctx.beginPath();
    points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
    ctx.stroke();
    ctx.globalAlpha = 1;
  };
  const circle = (x: number, y: number, radius: number) => {
    ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fill();
  };
  const screen = (x: number, y: number, width = 95) => {
    path([[x, y + 57], [x - 9, y], [x + width, y], [x + width + 9, y + 57], [x - 8, y + 57]], 6, 0.8);
    path([[x + 26, y + 18], [x + 16, y + 27], [x + 26, y + 36]], 4);
    path([[x + 55, y + 18], [x + 65, y + 27], [x + 55, y + 36]], 4);
    path([[x + 44, y + 14], [x + 36, y + 40]], 3, 0.65);
  };
  const seated = (x: number, y: number, reach: number, flip = 1) => {
    circle(x + flip * 13, y, 20);
    path([[x + flip * 8, y + 32], [x, y + 88]], 30);
    path([[x + flip * 9, y + 43], [x + flip * 35, y + 67], [x + flip * reach, y + 58]], 12);
    path([[x, y + 91], [x + flip * 44, y + 102], [x + flip * 35, y + 159], [x + flip * 57, y + 160]], 15);
    path([[x - flip * 14, y + 43], [x - flip * 22, y + 109], [x + flip * 22, y + 109]], 6, 0.5);
    path([[x - flip * 20, y + 113], [x - flip * 25, y + 160]], 5, 0.5);
  };
  path([[65, 294], [502, 294]], 2, 0.22);
  if (scene === 0) {
    const kick = Math.sin(time * 2.5);
    path([[423, 283], [423, 112], [506, 112], [506, 283]], 5, 0.5);
    for (let i = 0; i < 5; i++) path([[425 + i * 20, 115], [425 + i * 20, 283]], 2, 0.2);
    for (let i = 0; i < 7; i++) path([[425, 132 + i * 22], [506, 132 + i * 22]], 2, 0.2);
    circle(257, 91, 21);
    path([[250, 125], [232, 192]], 32);
    path([[247, 139], [211, 145], [187, 127]], 13);
    path([[257, 142], [284, 169], [308, 166]], 13);
    path([[228, 204], [203, 247], [176, 278], [158, 278]], 17);
    path([[242, 204], [281, 217 - kick * 7], [319, 233 - kick * 23], [337, 228 - kick * 23]], 17);
    const ballX = 357 + (Math.sin(time * 1.25) + 1) * 39;
    const ballY = 235 - Math.abs(Math.sin(time * 2.5)) * 39;
    circle(ballX, ballY, 17);
    ctx.globalCompositeOperation = "destination-out";
    circle(ballX, ballY, 6);
    ctx.globalCompositeOperation = "source-over";
    path([[115, 155], [143, 146]], 3, 0.25);
    path([[103, 171], [133, 162]], 3, 0.2);
  } else if (scene === 1) {
    seated(170, 117, 105 + Math.sin(time * 1.7) * 9);
    path([[238, 224], [455, 224]], 8, 0.75);
    path([[251, 228], [251, 291]], 6, 0.5);
    path([[440, 228], [440, 291]], 6, 0.5);
    for (let row = 0; row < 4; row++) for (let col = 0; col < 8; col++) {
      ctx.globalAlpha = (row + col) % 2 ? 0.55 : 0.15;
      ctx.fillRect(259 + col * 21, 183 + row * 9, 19, 8);
    }
    ctx.globalAlpha = 1;
    [277, 319, 382, 403].forEach((x, i) => {
      circle(x, 165 + (i % 2) * 17, 6);
      path([[x, 172 + (i % 2) * 17], [x, 186 + (i % 2) * 9]], 7);
      path([[x - 7, 189 + (i % 2) * 8], [x + 7, 189 + (i % 2) * 8]], 5);
    });
  } else if (scene === 2) {
    seated(217, 113, 105 + Math.sin(time * 7) * 3);
    screen(321, 135);
    path([[202, 217], [474, 217]], 8, 0.8);
    path([[289, 204], [328, 204]], 4);
    path([[450, 222], [450, 292]], 6, 0.5);
    path([[453, 195], [468, 195], [468, 176], [453, 176], [453, 195]], 4, 0.6);
  } else {
    seated(142, 119, 79 + Math.sin(time * 6) * 3);
    seated(445, 119, 78 + Math.cos(time * 6) * 3, -1);
    screen(255, 139, 82);
    path([[197, 222], [395, 222]], 8, 0.8);
    path([[219, 229], [219, 291]], 6, 0.45);
    path([[374, 229], [374, 291]], 6, 0.45);
    path([[280, 62], [263, 80], [280, 98]], 5, 0.7);
    path([[322, 62], [339, 80], [322, 98]], 5, 0.7);
    path([[308, 59], [294, 99]], 4, 0.6);
  }
}

export function PersonalScenes({ animated, progress, onJump }: {
  animated: boolean;
  progress: RefObject<{ value: number; draw?: (progress: number) => void }>;
  onJump: (index: number) => void;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [scene, setScene] = useState(0);
  const selected = useRef(0);
  useEffect(() => {
    const element = canvas.current;
    const driver = progress.current;
    if (!element || !driver) return;
    const ctx = element.getContext("2d");
    const mask = document.createElement("canvas");
    mask.width = 560; mask.height = 340;
    const ink = mask.getContext("2d", { willReadFrequently: true });
    if (!ctx || !ink) return;
    type Dot = { x: number; y: number; alpha: number };
    const sample = (index: number, time: number) => {
      drawScene(ink, index, time);
      const pixels = ink.getImageData(0, 0, 560, 340).data;
      const dots: Dot[] = [];
      for (let y = 5; y < 340; y += 6) for (let x = 5; x < 560; x += 6) {
        const alpha = pixels[(y * 560 + x) * 4 + 3] / 255;
        if (alpha > 0.05) dots.push({ x, y, alpha });
      }
      return dots;
    };
    const draw = (value: number) => {
      const position = Math.max(0, Math.min(3.999, value * 4));
      const index = Math.floor(position);
      const local = position - index;
      const blend = index < 3 ? Math.max(0, (local - 0.76) / 0.24) : 0;
      const eased = blend * blend * (3 - 2 * blend);
      const from = sample(index, Math.min(local, 0.76) * 4);
      const to = blend > 0 ? sample(index + 1, 0) : from;
      ctx.clearRect(0, 0, 560, 340);
      ctx.fillStyle = "#c4f561";
      const count = Math.max(from.length, to.length);
      for (let i = 0; i < count; i++) {
        const a = from[Math.min(from.length - 1, Math.floor(i * from.length / count))];
        const b = to[Math.min(to.length - 1, Math.floor(i * to.length / count))];
        if (!a || !b) continue;
        const alpha = a.alpha + (b.alpha - a.alpha) * eased;
        const arc = Math.sin(eased * Math.PI) * Math.sin(i * 0.12) * 16;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(a.x + (b.x - a.x) * eased, a.y + (b.y - a.y) * eased + arc, 1.3 + alpha * 0.7, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      const current = blend > 0.5 ? index + 1 : index;
      if (selected.current !== current) { selected.current = current; setScene(current); }
    };
    driver.draw = draw;
    draw(animated ? driver.value : selected.current / 4 + 0.1);
    return () => { if (driver.draw === draw) driver.draw = undefined; };
  }, [animated, progress]);

  return (
    <section id="hobbies" className="hobbies section-space">
      <div className="hobbies-pin">
        <div className="hobbies-heading">
          <span className="eyebrow">STILL EXPLORING / 0{scene + 1}</span>
          <h2 key={scene}><em>{scenes[scene].title}</em></h2>
          <p>{scenes[scene].line}</p>
          <div className="hobby-scene-nav" role="group" aria-label="Choose a personal scene">
            {scenes.map((item, index) => <button key={item.name} aria-pressed={scene === index} onClick={() => onJump(index)}>{item.name}</button>)}
          </div>
          <span className="hobby-scroll-hint">{animated ? "↓ Keep scrolling" : "Choose a scene"}</span>
        </div>
        <div className="personal-scenes">
          <canvas ref={canvas} width={560} height={340} role="img" aria-label={"Dot-matrix illustration of Aditya: " + scenes[scene].name} />
        </div>
      </div>
    </section>
  );
}
