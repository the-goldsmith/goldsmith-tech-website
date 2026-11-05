(() => {
  const frame = document.querySelector(".visual-frame");
  const canvas = document.querySelector("#hero-scene");
  const toggle = document.querySelector("#hero-scene-toggle");
  const context = canvas?.getContext("2d");
  if (!frame || !canvas || !toggle || !context) {
    if (toggle) {
      toggle.disabled = true;
      toggle.textContent = "SCENE UNAVAILABLE";
    }
    return;
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const particles = Array.from({ length: 22 }, (_, index) => ({
    angle: (index / 22) * Math.PI * 2,
    radius: 0.17 + (index % 5) * 0.026,
    speed: (index % 2 ? 1 : -1) * (0.08 + (index % 4) * 0.015),
    height: ((index % 7) - 3) * 0.045
  }));
  let width = 0;
  let height = 0;
  let pixelRatio = 1;
  let elapsed = 0;
  let lastFrameTime = 0;
  let frameRequest = null;
  let sceneVisible = true;
  let isPlaying = !reducedMotion.matches;
  let pointerX = 0;
  let pointerY = 0;
  let targetX = 0;
  let targetY = 0;

  function updateToggle() {
    toggle.setAttribute("aria-pressed", String(isPlaying));
    toggle.setAttribute("aria-label", `${isPlaying ? "Pause" : "Play"} the interactive concept scene`);
    toggle.innerHTML = `${isPlaying ? "PAUSE" : "PLAY"} SCENE <span aria-hidden="true">${isPlaying ? "Ⅱ" : "↗"}</span>`;
  }

  function scheduleFrame() {
    if (frameRequest === null && sceneVisible && document.visibilityState === "visible") {
      frameRequest = window.requestAnimationFrame(renderScene);
    }
  }

  function resizeScene() {
    const bounds = frame.getBoundingClientRect();
    width = bounds.width;
    height = bounds.height;
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    scheduleFrame();
  }

  function project(x, y, z, centerX, centerY, angleY, angleX) {
    const rotatedX = x * Math.cos(angleY) + z * Math.sin(angleY);
    const depthY = -x * Math.sin(angleY) + z * Math.cos(angleY);
    const rotatedY = y * Math.cos(angleX) - depthY * Math.sin(angleX);
    const rotatedZ = y * Math.sin(angleX) + depthY * Math.cos(angleX);
    const scale = 520 / (520 + rotatedZ);
    return {
      x: centerX + rotatedX * scale,
      y: centerY + rotatedY * scale,
      scale
    };
  }

  function drawOrbit(centerX, centerY, radiusX, radiusY, phase, angleY, angleX, opacity) {
    context.beginPath();
    for (let step = 0; step <= 120; step += 1) {
      const angle = (step / 120) * Math.PI * 2;
      const point = project(
        Math.cos(angle) * radiusX,
        Math.sin(angle) * radiusY,
        Math.sin(angle * 2 + phase) * 19,
        centerX,
        centerY,
        angleY,
        angleX
      );
      if (step === 0) context.moveTo(point.x, point.y);
      else context.lineTo(point.x, point.y);
    }
    context.strokeStyle = `rgba(196, 224, 159, ${opacity})`;
    context.lineWidth = 0.8;
    context.stroke();
  }

  function renderScene(timestamp = 0) {
    frameRequest = null;
    if (!sceneVisible || document.visibilityState !== "visible") return;
    const delta = lastFrameTime ? Math.min((timestamp - lastFrameTime) / 1000, 0.05) : 0;
    lastFrameTime = timestamp;
    if (isPlaying) elapsed += delta;
    pointerX += (targetX - pointerX) * 0.08;
    pointerY += (targetY - pointerY) * 0.08;

    context.clearRect(0, 0, width, height);
    const centerX = width * 0.53;
    const centerY = height * 0.49;
    const angleY = elapsed * 0.18 + pointerX * 0.16;
    const angleX = -0.16 + pointerY * 0.1;
    const boxWidth = width * 0.23;
    const boxHeight = height * 0.27;
    const boxDepth = Math.min(width, height) * 0.17;
    const vertices = [];

    for (const z of [-boxDepth, boxDepth]) {
      for (const y of [-boxHeight, boxHeight]) {
        for (const x of [-boxWidth, boxWidth]) {
          vertices.push(project(x, y, z, centerX, centerY, angleY, angleX));
        }
      }
    }

    context.save();
    context.globalCompositeOperation = "screen";
    context.shadowColor = "rgba(201, 235, 159, .64)";
    context.shadowBlur = 9;
    context.strokeStyle = "rgba(190, 223, 161, .53)";
    context.lineWidth = 0.85;
    const edges = [[0, 1], [0, 2], [1, 3], [2, 3], [4, 5], [4, 6], [5, 7], [6, 7], [0, 4], [1, 5], [2, 6], [3, 7]];
    for (const [from, to] of edges) {
      context.beginPath();
      context.moveTo(vertices[from].x, vertices[from].y);
      context.lineTo(vertices[to].x, vertices[to].y);
      context.stroke();
    }

    drawOrbit(centerX, centerY, width * 0.36, height * 0.27, elapsed * 0.3, angleY, angleX, 0.38);
    drawOrbit(centerX, centerY, width * 0.29, height * 0.36, elapsed * -0.21, angleY + 0.55, angleX, 0.22);

    particles.forEach((particle, index) => {
      const angle = particle.angle + elapsed * particle.speed;
      const point = project(
        Math.cos(angle) * width * particle.radius,
        Math.sin(angle) * height * particle.radius + particle.height * height,
        Math.sin(angle * 2) * boxDepth,
        centerX,
        centerY,
        angleY,
        angleX
      );
      const next = particles[(index + 1) % particles.length];
      const nextAngle = next.angle + elapsed * next.speed;
      const neighbor = project(
        Math.cos(nextAngle) * width * next.radius,
        Math.sin(nextAngle) * height * next.radius + next.height * height,
        Math.sin(nextAngle * 2) * boxDepth,
        centerX,
        centerY,
        angleY,
        angleX
      );
      if (Math.hypot(point.x - neighbor.x, point.y - neighbor.y) < Math.min(width, height) * 0.25) {
        context.beginPath();
        context.moveTo(point.x, point.y);
        context.lineTo(neighbor.x, neighbor.y);
        context.strokeStyle = "rgba(179, 214, 162, .18)";
        context.lineWidth = 0.7;
        context.stroke();
      }
      context.beginPath();
      context.arc(point.x, point.y, index % 4 === 0 ? 1.8 : 1.1, 0, Math.PI * 2);
      context.fillStyle = "rgba(220, 244, 186, .78)";
      context.fill();
    });

    context.shadowBlur = 0;
    context.fillStyle = "rgba(222, 237, 203, .82)";
    context.font = "8px monospace";
    context.letterSpacing = "1px";
    context.fillText("FIELD SYSTEMS / 01", 18, 30);
    context.fillStyle = "rgba(202, 219, 184, .56)";
    context.fillText("3D CONCEPT STUDY", 18, 43);
    context.fillText("HUMAN-LED · LOCAL RENDER", Math.max(18, width - 190), height - 19);
    context.restore();

    if (isPlaying) scheduleFrame();
  }

  toggle.addEventListener("click", () => {
    isPlaying = !isPlaying;
    lastFrameTime = 0;
    updateToggle();
    scheduleFrame();
  });

  frame.addEventListener("pointermove", (event) => {
    const bounds = frame.getBoundingClientRect();
    targetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    targetY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    if (!isPlaying) {
      pointerX = targetX;
      pointerY = targetY;
    }
    scheduleFrame();
  });
  frame.addEventListener("pointerleave", () => {
    targetX = 0;
    targetY = 0;
    if (!isPlaying) {
      pointerX = 0;
      pointerY = 0;
    }
    scheduleFrame();
  });

  reducedMotion.addEventListener("change", (event) => {
    if (event.matches) isPlaying = false;
    lastFrameTime = 0;
    updateToggle();
    scheduleFrame();
  });
  document.addEventListener("visibilitychange", scheduleFrame);
  if ("ResizeObserver" in window) new ResizeObserver(resizeScene).observe(frame);
  else window.addEventListener("resize", resizeScene, { passive: true });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => {
      sceneVisible = entry.isIntersecting;
      scheduleFrame();
    }).observe(frame);
  }

  resizeScene();
  updateToggle();
})();
